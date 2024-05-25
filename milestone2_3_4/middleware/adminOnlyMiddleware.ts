import { NextFunction, Request, Response } from "express";

export function adminOnlyMiddleware(req: Request, res: Response, next: NextFunction) {
    if (res.locals.user && res.locals.user.role === "Admin") {
        next();
    } else {
        res.redirect('/overview');
    }
}