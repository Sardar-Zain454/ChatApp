
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
        unique: true,
        validate: validator.isEmail,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true,
    },

    profilePic: {
        type: String,
        required: false
    },

    // (id of profile image in cloudinary service)
    publicId: {
      type: String, 
      required: false
    },

    lastseen: {
        type: Date,
        default: null,
        required: false
    },

    passwordChangedAt: {
        type: Date,
        required: false
    }

}, {timestamps: true} );

// defined them before creating the model.
userSchema.methods.isPasswordChangedAfterTokenIssued = async function(JWTIssuedTimeStamp) {

    if(this.passwordChangedAt) {
        return (this.passwordChangedAt.getTime() / 1000) > JWTIssuedTimeStamp.getTime();
    } else {
        return false;
    }
}



let userModel = model('users', userSchema); // users collection 
export default userModel;



