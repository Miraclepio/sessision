const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        // required:true//
    },
 
    password: {
        type: String,
        require: true
    },

    
    email: {
        type: String,
        required: true
    },
    picture: String,
    sub:String

 
   
}, { timestamps: true });

const UserModel = mongoose.model("googleSignUp", UserSchema);

module.exports = UserModel; 
 