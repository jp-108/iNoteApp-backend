import express from "express";
import "./db/config.js";
import UserModel from "./db/User.js";
import Signup from "./Route/Signup.js";
import Login from "./Route/Login.js";
import Notes from "./Route/notes.js";
import cors from "cors";


const app = express();
app.use(cors())
const port = 5400;
app.use(express.json());


app.use("/route", Signup);
app.use("/route", Login);
app.use("/route", Notes)

app.listen(port);
