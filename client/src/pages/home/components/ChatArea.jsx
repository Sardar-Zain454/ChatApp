
import React from 'react'
import { useSelector } from 'react-redux';




 const ChatArea = () => {
  let { selectedChat, user: loggedUser } = useSelector(state => state.userReducer);


  let getFullName = () => {

     let user = selectedChat.members.find(member => member._id != loggedUser._id);

       let fn = user?.firstname;
       let ln = user?.lastname;

       if(!fn || !ln) return 'Anonymous User';

       let fname = fn.charAt(0).toUpperCase() +
                   fn.substring(1).toLowerCase();

       let lname = ln.charAt(0).toUpperCase() + 
                   ln.slice(1).toLowerCase();
  
     return `${fname} ${lname}`;
  }


  return (
    <>
       {selectedChat &&
        
        <div class="app-chat-area">
            <div class="app-chat-area-header">
                {getFullName()}
            </div>
            <div>
                CHAT AREA
            </div>
            <div>
                SEND MESSAGE
            </div>
        </div>
        }
    </>
  )
}

export default ChatArea;
