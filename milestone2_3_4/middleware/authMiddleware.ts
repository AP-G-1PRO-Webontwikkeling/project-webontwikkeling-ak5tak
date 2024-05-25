import { Response, Request, NextFunction } from "express";

export function redirectIfAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (req.session && req.session.user) {
        res.redirect("/overview");
    } else {
        next();
    }
}