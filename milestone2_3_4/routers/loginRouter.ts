import express from "express";
import { User } from "../interfaces";
import { login } from "../modules/database";
import { redirectIfAuthenticated } from "../middleware/authMiddleware";

export function loginRouter() {
    const router = express.Router();

    router.get("/", redirectIfAuthenticated, async (req, res) => {
        res.render("login", { title: "Login", message: res.locals.message });
    });

    router.post("/", redirectIfAuthenticated, async (req, res) => {
        const username: string = req.body.madeUsername;
        const password: string = req.body.madePassword;
        const role: string = req.body.role;
        try {
            let user: User = await login(username, password, role);
            delete user.password;
            req.session.user = user;
            req.session.message = {type: "success", message: "You have successfully logged in!"};
            res.redirect("/overview");
        } catch (e: any) {
            req.session.message = {type: "error", message: e.message};
            res.redirect("/login");
        }
    });

    return router;
}