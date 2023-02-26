import express from "express";
import "./db/config.js";
import UserModel from "./db/User.js";
import Signup from "./Route/Signup.js";
import Login from "./Route/Login.js";
import Notes from "./Route/notes.js";

const app = express();
const port = 5400;
app.use(express.json());

app.use("/route", Signup);
app.use("/route", Login);
app.use("/route", Notes)

app.get("/", async (req, res) => {
  let result = await UserModel.find(req.body);
  // result = await result.toObject();
  res.send(result);
  console.log(result);
});

app.delete("/delete/:id", async (req, res) => {
  let result = await UserModel.deleteMany({ name: req.params.id });
  res.send(result);
});

app.put("/update/:id", async (req, res) => {
  let result = await UserModel.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  res.send(result);
});

app.listen(port);
