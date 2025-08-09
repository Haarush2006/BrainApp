import dotenv from "dotenv"
dotenv.config()
import express from "express";
import Mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { ContentModel, UserModel } from "./db";
import bcrypt from "bcrypt"
import {z} from "zod"
import { UserMiddleware } from "./middleware";
const app = express()
app.use(express.json());


app.post("/api/v1/signup",async (req,res)=>{


    const reqBody = z.object({
        email: z.string().min(3).max(50).email(),
        Password: z
            .string()
            .min(6)
            .refine((password) => /[A-Z]/.test(password), {
                message: "Required atleast one uppercase character",
            })
            .refine((password) => /[a-z]/.test(password), {
                message: "Required atleast one lowercase character",
            })
            .refine((password) => /[0-9]/.test(password), {
                message: "Required atleast one number",
            })
            .refine((password) => /[!@#$%^&*]/.test(password), {
                message: "Required atleast one special character",
            }),
        Username: z.string().min(3).max(30),
  });

  const parsedData = reqBody.safeParse(req.body);

  if(!parsedData.success){
    res.json({
        message:"Incorrect Format",
        error: parsedData.error.issues[0].message
    })
    return
  }


    const {email, Username, Password} = req.body

    const hashedPass = await bcrypt.hash(Password,7)

    try {
        await UserModel.create({
            email,
            Username,
            Password: hashedPass
        });
        return res.json({ message: "User Created Successfully" });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "Username or email already exists" });
        }
        return res.status(500).json({ message: "Internal server error" });
    }


})
app.post("/api/v1/signin",async (req,res)=>{

    try{

        const {email, Password} = req.body
        const Existingn= await UserModel.findOne({
            email
        })

        if(!Existingn){
            return res.json({
                message:"User Not Found"
            })
        }
    const isCorrect = await bcrypt.compare(Password, String(Existingn.Password))
        if (!isCorrect) {
            return res.json({ message: "Incorrect password" });
        }
        const  token = jwt.sign({
            id:Existingn._id
        },process.env.JWT_USER_SECRET!)

        return res.json({
            token
        })
    } catch {
        res.json({
            message:"Unable to signin now"
        })
    }



})
app.post("/api/v1/content",UserMiddleware,async (req,res)=>{
    const {title, link} = req.body

    await ContentModel.create({
        title,
        link,
        // @ts-ignore
        UserId: req.userId,
        tags: []
    })

    res.json({
        message:"Added content"
    })
})
app.get("/api/v1/content",UserMiddleware,async (req,res)=>{
    const content = await ContentModel.findOne({
        //@ts-ignore
        UserId:req.userId
    }).populate("UserId","Username")
    res.json(content)
})
app.delete("/api/v1/content",UserMiddleware,async (req,res)=>{

    const {contentId} = req.body
    try {
        await ContentModel.deleteOne({
            // @ts-ignore
            UserId: req.userId,
            _id: contentId
        })
        res.json({
            message:"Deleted successfully"
        })
    } catch  {
        res.json({
            message:"Unable to delete"
        })
    }


    await ContentModel.deleteOne({

    })
    res.json()

})
app.get("/api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000)