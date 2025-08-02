
import { Schema, model } from "mongoose";


const messageSchema = new Schema({
     
    // to which chat this message belongs
    chatId: {
        type: Schema.Types.ObjectId,
         ref: 'chats'
    },

    sender: {
        type: Schema.Types.ObjectId,
        ref: 'users',
    },

    text: {
        type: String,
        required: true
    },

    read: {
        type: Boolean,
        default: false
    }

}, {timestamps: true});


let messageModel = model('messages', messageSchema);
export default messageModel;

