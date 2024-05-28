import { NextFunction, Request, Response } from "express";

export function flashMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.session.message) {
        res.locals.message = req.session.message;
        delete req.session.message; // Dit zorgt ervoor dat het 1x wordt getoond en niet meerdere malen
    } else {
        res.locals.message = undefined;
    }
    next();
};