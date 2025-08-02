import {Schema, model} from 'mongoose';

let chatSchema = new Schema({

     members: {
        type: [
            {type: Schema.Types.ObjectId, ref: 'users'}
        ]
     },

/*
  names: {
   type: [{ type: String }]
}
OR
  names: {
   type: [String]
}
*/

   
     // it will not be shown first in chat document but when we update when message is sent then go and refresh that chat document to
     // see it.
     lastMessage: {
        type: Schema.Types.ObjectId, ref: 'messages',
     },

     unreadMessageCount: {
        type: Number,
        default: 0,
     }

}, {timestamps: true} );


let chatModel = model('chats', chatSchema);
export default chatModel;


