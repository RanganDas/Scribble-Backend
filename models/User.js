const mongoose = require('mongoose');
const { Schema }=mongoose;

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    phone: {
        type: String, // Since phone numbers can include dashes, spaces, etc., it's best to store them as strings
        validate: {
            validator: function (v) {
                // Use a regular expression to validate the phone number format
                return /^\d{10}$/.test(v);
            },
            message: 'Phone number must be 10 digits long'
        }
    },
    date:{
        type:Date,
        default:Date.now
    }
  });
  const User=mongoose.model('user', UserSchema);
  User.createIndexes();
  module.exports=User;