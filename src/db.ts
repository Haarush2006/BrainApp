import {model, Schema, ObjectId} from "mongoose";
import { email, string } from "zod";


const UserSchema = new Schema({
    email: {type: string},
    Username: {type:string, unique:true},
    Password: {type:string}
})


export const UserModel = model("users",UserSchema)