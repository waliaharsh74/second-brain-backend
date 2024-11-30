import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";


export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization = '' } = req?.headers

    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_PASSWORD || "")

    if (decoded) {
        //@ts-ignore
        req.userId = decoded.id
    }
    else {

        res.status(403).json({
            message: "You are not logged in"
        })
    }

    next()
}