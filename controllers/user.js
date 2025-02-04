const express = require("express");
const router = express.Router();
const {getUsers,createUser ,userModel} = require("../models/UserModel"); 
const {validateUser} = require("../utilis/validation")
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');





const handleRegister = async (req, res) => {
  try {
    const body = req.body;
    if (!validateUser(body)) {
      return res.status(400).json({ status: 400, message: "Fill required fields" });
    }

    const photo = req.file;
    if (!photo) {
      return res.status(400).json({ status: 400, message: "No photo uploaded" });
    }

    // The URL will be "https://your-server.com/uploads/filename"
    body.photo = `https://backend-zd8i.onrender.com/uploads/${photo.filename}`;
    
    const newUser = await createUser(body);

    if (!newUser) {
      return res.status(400).json({ status: 400, message: "Error occurred" });
    }

    return res.status(200).json({ status: 200, message: "Registered successfully", data: newUser });

  } catch (err) {
    return res.status(500).json({ status: 500, message: "Internal server error", err: err.message });
  }
};



const handleLogin = async(req,res) => {
 
  

  const { email , password } = req.body;

  // if(!loginValidate(req.body)) {
  //     return res.status(400).json({ status:400 , message:"Please fill required fields" ,});
  // }

  try {
      const user = await userModel.findOne({ email });
      if(user && await bcrypt.compare(password, user.password)) {
          const token = jwt.sign({id: user._id} ,JWT_SECRET , {
              expiresIn:'1h'
          });

          
          return res.status(200).json({
              status:200,
              message:"Login successful",
              data: user,
              token,
          });
      } else {
          return res.status(401).json({
              status:401,
              message:"Invalid email or password"
          });
      }

  }catch(err) {
      return res.status(500).json({
          status: 500,
          message: "Internal server error",
          error: err.message
      });

  }

}




module.exports = {
    handleRegister,
    handleLogin
};
