import mongoose, {model, Schema, ObjectId} from "mongoose";
import { email, string } from "zod";
import { required } from "zod/v4/core/util.cjs";

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

const tagsSchema = new Schema({
    title:{type: string, required: true}
})

const LinkSchema = new Schema({
    hash: {type: string, unique: true},
    UserId:{type:mongoose.Types.ObjectId,unique:true, ref: 'users'}
    
})

export const UserModel = model("users",UserSchema)
export const ContentModel = model("content",contentSchema)
export const TagModel = model("tag",tagsSchema)
export const LinkModel = model("link",LinkSchema)
