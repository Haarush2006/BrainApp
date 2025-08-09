import express from "express";
import Mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken"
import { UserModel } from "./db";
import bcrypt from "bcrypt"
import {z} from "zod"

const app = express()
app.use(express.json());

app.post("/api/v1/signin",async (req,res)=>{


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

    await UserModel.create({
        email,
        Username,
        Password:hashedPass
    })

})
app.post("/api/v1/signup",(req,res)=>{

})
app.get("/api/v1/content",(req,res)=>{

})
app.delete("/api/v1/content",(req,res)=>{

})
app.get("/api/v1/brain/:shareLink",(req,res)=>{

})

app.listen(3000,()=>console.log("Heloo"))