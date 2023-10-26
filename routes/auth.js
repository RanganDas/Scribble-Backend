const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Rangandas$123";

// Create a user using POST "/api/auth/createuser", no login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("phone", "Enter a valid phone number").custom((value) => {
      if (!/^\d{10}$/.test(value)) {
          throw new Error("Phone number must be 10 digits long");
      }
      return true; 
  }),
    body("password", "Password must have a minimum of 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    //if there are errors, return abd request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ success, error: "Sorry this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    secPass = await bcrypt.hash(req.body.password, salt);

    try {
      //check if the user email already exists
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        phone:req.body.phone,
        password: secPass,
      });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({ success, authToken });
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        return res.status(400).json({ error: "Email already exists" });
      }
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Authenticate a user using POST "/api/auth/login", no login required
router.post(
  "/login",
  [
    
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(), 
  ],
  async (req, res) => {
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password}=req.body;
    try{
        let user= await User.findOne({email})
        if(!user){
            return res.status(400).json({error:"Please try to login with correct credentials"})
        }

        const passwordCompare= await bcrypt.compare(password,user.password)
        if(!passwordCompare){
          success=false
            return res.status(400).json({success, error:"Please try to login with correct credentials"})
        }
        const data={
            user:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        success=true
        res.json({ success, authToken });

    } catch(error){
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
  }

);

// Get user details using POST "/api/auth/getuser", Login required
router.post("/getuser",fetchuser, async (req, res) => {
    try {
        userId=req.user.id
        const user=await User.findById(userId).select('-password')
        res.send(user)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }

})
module.exports = router;
