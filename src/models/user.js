const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {type: String, required:true,unique:true},
    phone_number: {type:Number,required:true,unique:true},
    password: {type:String,required:true,unique:true},
})



const User = mongoose.model('User',UserSchema);

module.exports = User;