import express from "express";
import { User } from "../interfaces";
import { register } from "../modules/database";
import { redirectIfAuthenticated } from "../middleware/authMiddleware";

export function startPageRouter() {
    const router = express.Router();

    router.get("/", redirectIfAuthenticated, (req, res) => {
        res.render("startPage", { title: "Register", message: res.locals.message }); 
    });

    router.post("/", redirectIfAuthenticated, async (req, res) => {
        const username: string = req.body.newUsername;
        const password: string = req.body.newPassword;

        try {
            const user: User = await register(username, password);
            delete user.password;
            res.redirect("/login");
        } catch (e: any) {
            req.session.message = {type: "error", message: e.message};
            res.redirect("/");
        }
    });

    return router;
}