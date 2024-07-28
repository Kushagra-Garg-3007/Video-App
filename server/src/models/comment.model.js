import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
  comment:{
    type:String,
    required:true
  },
  user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  video:{
    type:Schema.Types.ObjectId,
    ref:"Video"
  }
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema);
