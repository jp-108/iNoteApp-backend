import express from "express";
import { body, validationResult } from "express-validator";
import UserModel from "../db/User.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const JWT_SECRETE = "jay@123"


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
    const success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    //Check whethere the user with this email already exist.

    try {

      let user = await UserModel.findOne({email:req.body.email});
  
      if(user){
        return res.status(400).json({success, error:"Sorry, Email Id is already in use, Please use different Email Id."})
      }
      
      //**** save method*** */
      // let user = new UserModel(req.body);
      // let result = await user.save();
      // res.send(result);
      //******** */

      //***********Using create method */
      const salt = await bcrypt.genSalt(10);

      let  secPass = await bcrypt.hash(req.body.password,salt);
      user = await UserModel.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email
      });

      const data = {
        user:{
          id:user.id
        }
      }
      const authToken = JWT.sign(data, JWT_SECRETE);

      res.json({success:true, authToken});
    
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success,
        result: "some error occured",
        message: error.message,
      });
      next();
    }
  }
);

export default Router;
