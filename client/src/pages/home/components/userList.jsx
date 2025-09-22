
import { useSelector } from 'react-redux';
import { createNewChat } from './../../../apiCalls/chat.jsx'; // Importing createNewChat function to handle chat creation
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../../redux/loaderSlice';
import { setAllChats, setSelectedChat } from '../../../redux/userSlice.jsx';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import store from './../../../redux/store.jsx';

function UserList({ searchKey, socket }) {
  let id;
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
  let getLastMessageOrEmail = (user) => {
      let chat = allChats.find(chat => {
        return (chat.members.map(m => m._id).includes(user._id) &&
        chat.members.map(m => m._id).includes(currentlyLoggedUser._id))
  });
 
  // chat is because if user is searched then it is not in any chat then for that we have to show email id
  // first of all the user is in chats and secondly the other user must send him one message
  if(chat && chat.lastMessage) {
        let msg = chat.lastMessage.text;
        let msgPrefix = chat.lastMessage.sender === currentlyLoggedUser._id ? "YOU: " : "";

          if(msg.length >= 25) {
              return msgPrefix + msg.slice(0, 26).concat(".....");
          } else {
              return msgPrefix + msg;
          }
    }
    
    
    let email = user?.email;
      if(!email) return "no email found!";
    return email.toLowerCase();
  }
  let getLastMessageTimeStamp = (user) => {
      let chat = allChats.find(chat => {
        return (chat.members.map(m => m._id).includes(user._id) &&
        chat.members.map(m => m._id).includes(currentlyLoggedUser._id))
  });

  if(chat && chat.lastMessage) {
        let timestamp = chat.lastMessage.createdAt;
        return dayjs(timestamp).format('hh:mm a');
  } else {
      return "";
  }
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

   // if there is nothing inside the givenChat then we have to show a start chat button.
    if(givenChat) {
        dispatcher(setSelectedChat(givenChat));
    }   
    
    // if there is no schat find then for that we have show the start chat button for it.
  } 

  let showUnReadMessageCount =  (userId) => {

      let givenChat = allChats.find(chat => 
                chat.members.map(m => m._id).includes(userId) &&
                chat.members.map(m => m._id).includes(currentlyLoggedUser._id)
    );

    if(givenChat && givenChat.unreadMessageCount && givenChat?.lastMessage?.sender !== currentlyLoggedUser._id) {
            return <div className='unread-message-count'>{givenChat.unreadMessageCount}</div>
    } 
      return "";
  }
  async function deleteChatFromDB(evt, userId) {}

      useEffect(()=>{
           socket
             .off('show-unread-message')
             .on('show-unread-message', (incommingMessage) => {

                  let chatsCopy = store.getState().userReducer.allChats;
                  let currentChat = store.getState().userReducer.selectedChat;
                  // let loginUser = store.getState().userReducer.user;

                  let chatIndex = -1, newCh;
                          let updatedChats = chatsCopy.map((chat, index) => {
                                  if(chat._id === incommingMessage.chatId) {
                                      chatIndex = index;
                                           newCh = { ...chat }
                                           newCh['lastMessage'] = incommingMessage;

                                      if(incommingMessage?.chatId !== currentChat?._id) {
                                              newCh['unreadMessageCount'] =  (chat?.unreadMessageCount || 0) + 1;
                                      }
                                      return newCh;
                                  }
                              return chat;
                          });

                           if(chatIndex != -1) {
                                updatedChats.splice(chatIndex, 1);
                                updatedChats.unshift(newCh);
                             } // end of the chatIndex 

                             dispatcher(setAllChats(updatedChats));
                    }) // end of on
                          // dispatcher(setSelectedChat())

          socket
          .off('showing-typing-status')
          .on('showing-typing-status', (userInfo)=>{
            if(userInfo?.toWhichStatusShowing?._id === currentlyLoggedUser?._id) {
                if(id) {
                    clearTimeout(id);
                }
                  let typingElement = document.getElementById('typing-status');
                 typingElement.innerText = "typing..."
                 typingElement.classList.add('style-me-please');

                  id = setTimeout(()=>{
                        let lastMsg = getLastMessageOrEmail({_id: userInfo?.toWhichStatusShowing?._id});
                            typingElement.innerText = lastMsg;
                            typingElement.classList.remove('style-me-please');
                 }, 1000);
            
            }


          });
      },[]);

  let searchKEY = searchKey.toLowerCase().trim();

    function getData() {
        if(searchKEY === "") {
            return allChats; // returns as in ascedning order. and chats contains users 
        } else {
            return (allUsers.filter((user) => {
                    return (user.firstname.toLowerCase().trim().includes(searchKEY) ||
                    user.lastname.toLowerCase().trim().includes(searchKEY) ||
                    (user.firstname+" "+user.lastname).toLowerCase().trim().includes(searchKEY))
            }))
        }
    }


    return(
       getData().map((objData) => {
          let user = objData;
        if(objData.members) {
            user = objData.members.find(member => member._id !== currentlyLoggedUser._id);
        }

            return (
                  <div className='user-search-filter'
                      onClick={(event)=>{displaySelectedChat(event, user._id)}}
                      key = {user._id}>

                        <div className = {selectedUser(user) ? 'selected-user' : "filtered-user"} >
                            <div className="filter-user-display">
                              {/* it is a flex and it has three direct child */}
                                    {user.profilePic && <img src={user.profilePic} alt="Profile Pic" class="user-profile-image" /> }
                              {!user.profilePic && <div className={selectedUser(user) ? "user-selected-avatar" : "user-default-avatar"}>
                                    {getInitials(user)}
                                </div> }
                                <div class="filter-user-details">
                                    <div class="user-display-name">{getFullName(user)}</div>
                                        {/* <div class="user-display-email">{getEmail(user)}</div> */}
                                        <div class="user-display-email" style={{ fontStyle: 'italic', marginLeft: '10px'}} id="typing-status">{getLastMessageOrEmail(user)}</div>
                                </div>
                                   <div style={{position: 'relative'}}>
                                    <div className='last-message-timestamp'>{getLastMessageTimeStamp(user)}</div>
                                        {showUnReadMessageCount(user._id)}
                                   </div>
                                {
                                  !allChats.some(chat => chat.members.map(m => m._id).includes(user._id)) &&
                                  (<div className="user-start-chat">
                                        <button onClick={(event)=>{createNewChatInDB(user._id, event)}} className="user-start-chat-btn">Start Chat</button>
                                  </div>)
                                }
                            </div>
                        </div>                        
                  </div>
              )
          })
    );
}

export default UserList;

 