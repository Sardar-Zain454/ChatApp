
import { useSelector } from 'react-redux';
import { createNewChat } from './../../../apiCalls/chat.jsx'; // Importing createNewChat function to handle chat creation
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../../redux/loaderSlice';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice.jsx';
import { useState } from 'react';




function UserList({ searchKey }) {

  let dispatcher = useDispatch();
  let { user: currentlyLoggedUser, allUsers, allChats, selectedChat } = useSelector(state => state.userReducer); // state represent store variable in store.jsx and state.userReducer; represent pertinent initialValue (object) eventually this value injects to user variable

  let getFullName = (user) => {

       let fn = user?.firstname;
       let ln = user?.lastname;

       if(!fn || !ln) return 'Anonymous User';

       let fname = fn.charAt(0).toUpperCase() +
                   fn.substring(1).toLowerCase();

       let lname = ln.charAt(0).toUpperCase() + 
                   ln.slice(1).toLowerCase();
  
     return `${fname} ${lname}`;
  }

  let getInitials = (user) => {
       let fn = user?.firstname;
       let ln = user?.lastname;

    if(!fn || !ln)  return 'AU'; 
    
    return `${fn.charAt(0).toUpperCase()}${ln.charAt(0).toUpperCase()}`;
  }

  let getEmail = (user) => {
    let email = user?.email;
    if(!email) return "no email found!";

    return email.toLowerCase();
  }

  
  async function createNewChatInDB(userId, evt) {
    evt.stopPropagation();

     const newChat = {
        members: [currentlyLoggedUser._id, userId],
     }

     let response = null;

       try {

            dispatcher(showLoader());
            response = await createNewChat(newChat);
            dispatcher(hideLoader());

            if(response.success) {
                toast.success(response.message);
                const updatedChats = [...allChats, response.data];
                dispatcher(setAllChats(updatedChats)); // one dispatch for that component so that it will re-render
                dispatcher(setSelectedChat(response.data)); // one dispatch for ChatArea componenet so that it will also re-render.

            } else {
                toast.error(response.message);
            }

       } catch (err) {
               response.message = response.message || 'Something went wrong while creating new chat'; //runs or works for only if above signupUser() calls causes some error.
               toast.error(response.message);
               dispatcher(hideLoader());
          }

  };


  async function deleteChatFromDB(evt, userId) {}

  function selectedUser(user) {

      if(selectedChat) {
          return selectedChat.members
                .map(member => member._id)
                .includes(user._id);
      } 

      return false;
     
  }


  let displaySelectedChat = (evt, userId) => {
    evt.stopPropagation();

    let givenChat = allChats.find(chat => 
      chat.members.map(m => m._id).includes(userId) &&
      chat.members.map(m => m._id).includes(currentlyLoggedUser._id)
    );

    if(givenChat) {
        dispatcher(setSelectedChat(givenChat));
    }   
    
    // if there is no schat find then for that we have show the start chat button for it.
  } 




  let searchKEY = searchKey?.toLowerCase().trim();


    return(
      allUsers
          .filter((user) => {
                  return (
                    ( (user.firstname.toLowerCase().trim().includes(searchKEY) ||
                    user.lastname.toLowerCase().trim().includes(searchKEY) ||
                    (user.firstname+" "+user.lastname).toLowerCase().trim().includes(searchKEY)) &&
                    searchKEY) || allChats.some(chat => chat.members.map(m => m._id).includes(user._id))
                  );
          })
          .map((user) => {
              return (
                  <div className='user-search-filter'
                      onClick={(event)=>{displaySelectedChat(event, user._id)}}
                      key = {user._id}>

                        <div className = {selectedUser(user) ? 'selected-user' : "filtered-user"} >
                            <div className="filter-user-display">
                                    {user.profilePic && <img src={user.profilePic} alt="Profile Pic" class="user-profile-image" /> }
                              {!user.profilePic && <div class={selectedUser(user) ? "user-selected-avatar" : "user-default-avatar"}>
                                    {getInitials(user)}
                                </div> }
                                <div class="filter-user-details">
                                    <div class="user-display-name">{getFullName(user)}</div>
                                        <div class="user-display-email">{getEmail(user)}</div>
                                </div>
                                {
                                  !allChats.some(chat => chat.members.map(m => m._id).includes(user._id)) &&
                                  <div className="user-start-chat">
                                        <button onClick={(event)=>{createNewChatInDB(user._id, event)}} className="user-start-chat-btn">Start Chat</button>
                                  </div>
                                }
                                {/* {
                                  allChats.some(chat => chat.members.map(m => m._id).includes(user._id)) &&
                                  <div className="user-start-chat">
                                        <button onClick={(event)=>{deleteChatFromDB(user._id, event)}} className="user-start-chat-btn">Delete Chat</button>
                                  </div>
                                } */}
                              
                            </div>
                        </div>                        
                  </div>
              )
          })
    );
}

export default UserList;

 