
import { Schema, model } from "mongoose";
import validator from "validator";
// all documents inserted in users collection will follow this schema:

const userSchema = new Schema({

    firstname: {
       type: String,
       required: [true, 'First name is required'],
       trim: true,
    },

    lastname: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        validate: validator.isEmail,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    profilePic: {
        type: String,
        required: false
    }
}, {timeStamps: true} );


let userModel = model('users', userSchema); // users collection 

export default userModel;
