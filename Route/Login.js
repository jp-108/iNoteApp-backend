import express from "express";
import { body, validationResult } from "express-validator";
import UserModel from "../db/User.js";

const Router = express.Router();

Router.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0] });
    }
    try {
      let result = await UserModel.findOne(req.body);
      res.send(result);
      console.log(result);
    } catch (error) {
      console.log(error);
      res.send({ result: "Email has been already used" });
      next();
    }
  }
);
export default Router;
