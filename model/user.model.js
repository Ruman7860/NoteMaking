// step - 1 importing mongoose.
import mongoose from "mongoose";

// creating user schema
const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    createdAt : {
        type: Date,
        default : Date.now(),
    }
});

const User = mongoose.model("User",userSchema);

export default User;
