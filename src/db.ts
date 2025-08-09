import mongoose, {model, Schema, ObjectId} from "mongoose";
import { email, string } from "zod";

mongoose.connect(process.env.DataBaseUrl!)

const UserSchema = new Schema({
    email: {type: string},
    Username: {type:string, unique:true},
    Password: {type:string}
})

const contentSchema = new Schema({
    title: String,
    link: String,
    tags:{type: [mongoose.Types.ObjectId], ref: 'Tag'},
    UserId:{type:mongoose.Types.ObjectId,unique:true, ref: 'users'}
})


export const UserModel = model("users",UserSchema)
export const ContentModel = model("content",contentSchema)