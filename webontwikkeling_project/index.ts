import * as readline from 'readline-sync';
import { Watch } from "./interfaces";
import { Measurement } from './interfaces';

let choices: string[] = ["View all data", "Filter by ID", "Exit"];

async function getData()
{
    try
    {
        const response = await fetch("https://raw.githubusercontent.com/ak5tak/jsons_and_images/main/ap_royal_oak.json");
        const watchArray: Watch[] = await response.json();
        showMenu(watchArray as Watch[]);
    }
    catch (error: any)
    {
        console.error("Probeer later terug opnieuw.");
    }
}

function viewAllData(watches: Watch[])
{
    for(let watch of watches)
    {
        console.log(`- ${watch.model} (${watch.id})`);
    }
}

function filterByID(input: number, watches: Watch[])
{   
    for(let watch of watches)
    {
        if(watch.id === input)
        {
            console.log(`- ${watch.model} ${watch.id}`);
            console.log(`- Description: ${watch.description}`);
            console.log(`- Price: ${watch.price} CHF`);
            console.log(`- Special edition: ${watch.special_edition}`);
            console.log(`- Release date: ${watch.release_date}`);
            console.log(`- Image: ${watch.image}`);
            console.log(`- Material: ${watch.material_type}`);
            
            console.log(`- Colors: ${showColors(watch.colors)}`);

            console.log("- Measurements:");
            console.log(`${showMeasurements(watch.measurements)}`);
            return;
        }
    }
    console.log("Please enter a valid ID.")
}

function showColors(colorArray: string[]): string
{
    let newString: string = "";

    for(let i = 0; i < colorArray.length; i++)
    {
        newString += colorArray[i];

        if(i < colorArray.length - 1)
        {
            newString += ", "
        }
    }

    return newString;
}

function showMeasurements(measures: Measurement[]) {
    return measures.map(measure => `\tMeasurement ID: ${measure.measurement_id} \n\tSize: ${measure.size}mm \n\tThickness: ${measure.thickness}mm \n\tWater resistance: ${measure.water_resistance}m`).join("\n");
}

function showMenu(watches: Watch[])
{
    console.log("Welcome to our JSON watches data!")
    let choice: number = readline.keyInSelect(choices, "Please enter your choice: ", {cancel: false, guide: false});
    
    while(choice !== 2)
    {
        if(choice === 0)
        {
            viewAllData(watches);
        }
        else if(choice === 1)
        {
            let numberChoice: number = readline.questionInt("Please enter the ID you want to filter by: ");
            filterByID(numberChoice, watches);
        }

        choice = readline.keyInSelect(choices, "Welcome to our JSON watches data!\n Please enter your choice: ", {cancel: false, guide: false});
    }
    
}

getData();

export {}