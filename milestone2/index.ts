import express, { Express, query } from "express";
import dotenv from "dotenv";
import path from "path";
import { Watch } from "./interfaces";
import { Measurement } from "./interfaces";
import { title } from "process";

dotenv.config();

const app : Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, "views"));

app.set("port", process.env.PORT || 3000);

let watches: Watch[] = [];

app.get("/", (req, res) => {
    
    const sortField = typeof req.query.sortField === "string" ? req.query.sortField : "name";
    const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
    let sortedWatches = [...watches].sort((a, b) => {
        if (sortField === "model") {
            return sortDirection === "asc" ? a.model.localeCompare(b.model) : b.model.localeCompare(a.model);
        } else if (sortField === "releaseDate") {
            const dateA = new Date(a.release_date).getTime();// Convert to milliseconds
            const dateB = new Date(b.release_date).getTime();
            return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortField === "specialEdition") {
            if(a.special_edition && !b.special_edition) {
                return sortDirection === "asc" ? -1 : 1;
            } else if (!a.special_edition && b.special_edition) {
                return sortDirection === "asc" ? 1 : -1;
            } else {
                return 0;
            }
        } else if (sortField === "colors") {
            const colorsA = a.colors; 
            const colorsB = b.colors;
            return sortDirection === "asc" ? colorsA.length - colorsB.length : colorsB.length - colorsA.length;
        }  else if (sortField === "material") {
            return sortDirection === "asc" ? a.material_type.localeCompare(b.material_type) : b.material_type.localeCompare(a.material_type);
        } else {
            return 0;
        }
    });

    const sortFields = [
        { sizeCol: 4, value: 'model', text: 'Model', selected: sortField === 'model' ? 'selected' : '' },
        { sizeCol: 2, value: 'releaseDate', text: 'Release Date', selected: sortField === 'releaseDate' ? 'selected' : ''},
        { sizeCol: 1, value: 'specialEdition', text: 'Special Edition', selected: sortField === 'specialEdition' ? 'selected' : ''},
        { sizeCol: 2, value: 'colors', text: 'Colors', selected: sortField === 'colors' ? 'selected' : ''},
        { sizeCol: 2, value: 'material', text: 'Material', selected: sortField === 'material' ? 'selected' : ''}
    ];
    
    const sortDirections = [
        { value: 'asc', text: 'Ascending', selected: sortDirection === 'asc' ? 'selected' : ''},
        { value: 'desc', text: 'Descending', selected: sortDirection === 'desc' ? 'selected' : ''}
    ];

    if(typeof req.query.q === "string") {
        if (req.query.q === "") {
            res.render("index", {
                title: "Home",
                watches: sortedWatches,
                sortFields: sortFields,
                sortDirections: sortDirections,
                sortField: sortField,
                sortDirection: sortDirection,
                query: ""
            });
        }
        let query = req.query.q.toLowerCase();
        const filteredWatches = sortedWatches.filter((watch) => {
            return watch.model.toLocaleLowerCase().includes(query);
        });
        res.render("index", {
            title: "Home",
            watches: filteredWatches,
            sortFields: sortFields,
            sortDirections: sortDirections,
            sortField: sortField,
            sortDirection: sortDirection,
            query: query
        });
    }
    else {
        res.render("index", {
            title: "Home",
            watches: sortedWatches,
            sortFields: sortFields,
            sortDirections: sortDirections,
            sortField: sortField,
            sortDirection: sortDirection,
            query: ""
        });
    }
});

app.get("/watches", (req, res) => {
    res.render("watches", {
        title: "Watches",
        watches: watches
    });
});

app.get("/watches/:model", (req, res) => {
    const model = req.params.model;
    const singleWatchArray = watches.filter((watch) => {
        return watch.model === model;
    });

    const title = singleWatchArray[0].model;

    res.render("watches", {
        title: title,
        watches: singleWatchArray
    });
});

app.get("/sizes", (req, res) => {
    res.render("sizes", {
        title: "Sizes",
        watches: watches
    });
});

app.get("/sizeCard/:model", (req, res) => {
    const model = req.params.model;
    const singleWatchArray = watches.filter((watch) => {
        return watch.model === model;
    });

    const size = singleWatchArray[0].size_measurement.size;
    const title = singleWatchArray[0].model;

    res.render("sizeCard", {
        title: `Size: ${size} ${title}`,
        watches: singleWatchArray
    });
});

app.listen(app.get("port"), async() => {
    let response = await fetch("https://raw.githubusercontent.com/ak5tak/jsons_and_images/main/ap_royal_oak.json");
    watches = await response.json();
    console.log("Server started on http://localhost:" + app.get('port'));
});