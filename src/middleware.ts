import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const UserMiddleware = (req:Request,res:Response,next:NextFunction) =>{
    const header = req.headers["authorization"]
    const decoded = jwt.verify(header as string,process.env.JWT_USER_SECRET!)
    if(decoded){
        // @ts-ignore
        req.userId = decoded.id
        next()
    }
    else{
        return res.json({
            message:"Token error"
        })
    }

}

