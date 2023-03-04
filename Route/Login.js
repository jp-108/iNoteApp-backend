import express from "express";
import { body, validationResult } from "express-validator";
import UserModel from "../db/User.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import fetchuser from "../middleware/fetchuser.js";

const JWT_SECRETE = "jay@123";

const Router = express.Router();


Router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    let success =false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await UserModel.findOne({ email });

      let userCompare = await bcrypt.compare(password, user.password);
      if (!userCompare) {
        return res
          .status(400)
          .json({success, error: "Please login using correct credential" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = JWT.sign(data, JWT_SECRETE);
      res.set({headers:{Authorization:authToken}})
      res.json({ success:true, authToken });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success,
        error: "Please login using correct credential",
        message: error.message,
      });
    }
  }
);

Router.post("/getuser",fetchuser, async (req,res)=>{
  try {
   let userId = req.user.id
    const user = await UserModel.findById(userId).select("-password");
    res.send(user)
  } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Please login using correct credential",
        message: error.message,
      });
  }
})

export default Router;
