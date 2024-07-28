import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js"
import videoRoutes from "./routes/video.routes.js";
import subscriptionRoute from "./routes/subscription.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import cors from "cors";
import nodemailer from "nodemailer";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

//nodemialer testing
// var transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: 'kushagra3007@gmail.com',
//     pass: 'xgxc wjen kdpr rllo'
//   }
// });
// var mailOptions = {
//   from: 'kushagra3007@gmail.com',
//   to: 'hgarg2601@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'Email sent!',
//   html: "<h1>Emai lby nodemail</h1>"
// };

// transporter.sendMail(mailOptions, function (error, info) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}))
app.use('/user', userRoutes);
app.use('/video', videoRoutes);
app.use('/subscription', subscriptionRoute);
app.use('/comment', commentRoutes);

export { app }