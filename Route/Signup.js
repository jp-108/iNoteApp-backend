import express from "express";
import { body, validationResult } from "express-validator";
import UserModel from "../db/User.js";

const Router = express.Router();

Router.post(
  "/signup",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = new UserModel(req.body);
      let result = await user.save();
      res.send(result);
      console.log(result);
    } catch (error) {
      console.log(error);
      res.send({
        result: "Email has been already used",
        message: error.message,
      });
      next();
    }
  }
);

export default Router;
