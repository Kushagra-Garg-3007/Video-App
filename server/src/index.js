// import "dotenv/config";
import mongoose from "mongoose";
import { app } from './app.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(`${process.env.DATABASE_URL}videoApp`)
  .then(() => {
    console.log(`database connected successfully`)
  })
  .catch((e) => {
    console.log(`err in databse connection`,e);
  })

const port=process.env.PORT || 8000;

app.listen(port, (req, res) => {
  console.log(`server started at ${port}`);
})