
import {useEffect, useRef, useState} from 'react'
import { useSelector } from 'react-redux';
import { sendMessageThunk, fetchAllMessagesThunk, clearAllMessagesThunk } from '../../../redux/userThunks';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import dayjs from 'dayjs';
import { addMessage, setAllChats } from '../../../redux/userSlice';
import store from '../../../redux/store';
import EmojiPicker from 'emoji-picker-react';

 const ChatArea = ( { socket } ) => {

  let { selectedChat, user: loggedUser, messages, allChats, onlineUsersList, allUsers} = useSelector(state => state.userReducer);
    let dispatcher = useDispatch();
    let[message, setMessage] = useState('');
    let[showEmojiPicker, updateEmojiPicker] = useState(false);
    let inputRef = useRef(null);

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

  function timeFormatter(timeStamp) {
      // Like: "2025-11-08T14:32:10+00:00" (ISO 8601 format by default)
    let now = dayjs(); // current date and time when that method is called,  for every message inside map function
    let messageTime = dayjs(timeStamp); // time when message was sent/created

    // even year, month and day is same then it will returns true onkly
        if (now.isSame(messageTime, 'days')) {
              return `Today ${dayjs(timeStamp).format('hh:mm a')}`;
        } else if (now.subtract(1, 'days').isSame(messageTime, 'days')) {
              return `Yesterday ${dayjs(timeStamp).format('hh:mm a')}`
        } else {
              return messageTime.format("MMM D YYYY, hh:mm a");
        }



     // moment("2025-09-10").format("MMMM Do YYYY, HH: MM A")  -> September 10th 2025, 12:00 AM")
        // moment("2025-09-10").format('MMM D YYYY, HH:MM A') -> Sep 10 2025, 12:00 AM
        // you can also avoid YYYY or HH MM A is also optional.
    /*  THIS FAILS
          let now = moment();
          // moment() gives current date and time and moment(timeStamp) gives the date and time when message was sent/created
          // at last we get the difference between these two in terms of 'days' you also use ('minutes', 'hours', 'days', 'weeks', 'months', 'years')
          let differnce = now.diff(moment(timeStamp), 'days');  // IT RETURNS WHOLE NO 0,1,2,3,4,5,....

          if(differnce === 0) {
                return `Today ${moment(timeStamp).format('hh:mm a')}`;
          } else if(differnce === 1) {
                return `Yesterday ${moment(timeStamp).format('hh:mm a')}`;
        } else {
                return moment(timeStamp).format('MMM D YYYY, hh:mm a')
        }
        // moment("2025-09-10").format("MMMM Do YYYY, HH: MM A")  -> September 10th 2025, 12:00 AM")
        // moment("2025-09-10").format('MMM D YYYY, HH:MM A') -> Sep 10 2025, 12:00 AM
        // you can also avoid YYYY or HH MM A is also optional.
        */
  }

  let handleOnKeyDown = (event) => {
      let flag = inputRef.current === document.activeElement;

      if(event.key === "Enter" && flag) {
            sendMsg();
      }
  }

   const sendMsg = async () => {

    if(message.trim() === '') return;

    let msg = {
              chatId: selectedChat._id,
              sender: loggedUser._id,
              text: message.trim(),
    }

    // this below order is very important:
     await dispatcher(sendMessageThunk(msg));
      socket.emit('send-message', {
                  ...msg,
                  roomsToSendThatMessage: selectedChat.members.map(m => m._id),
                  read: false,
                  createdAt: dayjs(),
                  updatedAt: dayjs()
      });

    setMessage('');
  }

      const clearMessagesInDBAndFetchAllMessages = async (lastMessageSender, load = null) => {

      if(load) dispatcher(showLoader());
            if(lastMessageSender !== loggedUser._id) {
                  // first wait for message clearance at backend then tell the sender that i cleared please re-fetch for that
                  // chatId
                  await dispatcher(clearAllMessagesThunk(selectedChat._id)); 
                        // i must tell the sender that i seen it
                        socket.emit('get-read-status', {
                                    chatId: selectedChat._id, // for the chat the sender have to fetch the messages
                                    target: lastMessageSender // room to which info for updated message fetching  is shared 
                              }
                        );
            }

            await dispatcher(fetchAllMessagesThunk(selectedChat._id));
            if(load) dispatcher(hideLoader());
}


      function checkAppositeUserIsOnline() {
                        let chatBuddy = selectedChat.members.find(member => member._id !== loggedUser._id);

                        let ls = chatBuddy?.lastseen;
                        if(ls === "online") {
                             document.getElementById('online_status').innerText = ls;
                        }
                        if(ls !== "online") {
                              document.getElementById('online_status').innerText = timeFormatter(new Date(ls).getTime()) // return milliseconds timeStamp
                        }

                        // reforing: take dependency away from array and put it on lastseen property right.
                        //  if(Object.values(onlineUsersList).includes(requiredUser._id)) {
                        //       document.getElementById('login_status').innerText = "online";
                        //       return;
                        //  } else {
                        //       document.getElementById('login_status').innerText = "";
                        //  }

                         // means he is offline:
                        // allUsers?.forEach(U => {
                        //       if(requiredUser._id === U._id) {

                        //             if(U.lastseen) {
                        //                         let element = document.getElementById('login_status');
                        //                         element.innerText = timeFormatter(U.lastseen);
                        //             }
                                    
                        //            }
                        //       })
}


            useEffect(() => {
                  let LMS = selectedChat?.lastMessage?.sender;
                  let load = 1;
                  clearMessagesInDBAndFetchAllMessages(LMS, load);

                        socket
                              .off('receive-message')
                              .on('receive-message', (incommingMessage) => {
                               let currentChat = store.getState().userReducer.selectedChat; // zain laiba
                               let loginUser = store.getState().userReducer.user; // zain

                                     if(incommingMessage?.chatId === currentChat?._id) {
                                                dispatcher(addMessage(incommingMessage));

                                     if(incommingMessage.sender !== loginUser?._id) {
                                          // i must tell the sender that i seen it
                                                    clearMessagesInDBAndFetchAllMessages(incommingMessage.sender);
                                     } 
                              }
                              // delete incommingMessage[roomsToSendThatMessage];
                              });


            // Always listen for the process who send the message.
            socket.off('show-read-status').on('show-read-status', (chatInformation) => {
                        let currentChat = store.getState().userReducer.selectedChat;

                  if(chatInformation.chatId === currentChat._id) {
                              dispatcher(fetchAllMessagesThunk(chatInformation.chatId));
                  }

            });





      if(selectedChat)  {
            checkAppositeUserIsOnline();
      }
            
            }, [selectedChat]);



            useEffect(() => {
                  const msgContainer = document.getElementById('main-chat-area');
                  msgContainer.scrollTop =  msgContainer.scrollHeight;
            }, [messages]);

    let handleMessageChange = (e) => {
        setMessage(e.target.value);
        socket.emit('typing', {toWhichStatusShowing: selectedChat?.members?.find(m => m?._id !== loggedUser?._id), me: loggedUser._id});
    }

  return (
    <>
        <div class="app-chat-area">
                  <div className="show_online">
                        <div className="on_line" id="online_status">
                        </div>
                        <div class="app-chat-area-header">
                              {getFullName()}
                        </div>
                  </div>


    {/* <div> // display: flex;  padding-inline: 30px; justify-content: space-between
  
      <div class="app-chat-area-header">
            {getFullName()}
      </div>
    </div> */}






            {/* All messages exist there below ... */}
            <div className='main-chat-area' id="main-chat-area">
                  {messages && messages?.map((message)=>{
                        return (
                        <div className="message-container" key={message._id} style={{alignItems: message.sender == loggedUser._id ? 'start' : 'end'}} >
                                    <div className={message.sender == loggedUser._id ? 'send-message' : 'received-message'}>{message.text}</div>
                                    {/* <div className='message-timestamp'>{moment(message.createdAt).format('HH:MM A')}</div> */}
                                    <div className='message-timestamp'>{timeFormatter(message.createdAt)}
                                          {
                                                (message.sender == loggedUser._id && message.read) &&
                                                <i className='fa fa-check-circle' aria-hidden="true" style={{color: '#e74c3c', marginLeft: '10px', border:'1px solid #e74c3c', borderRadius: '50%'}}/>
                                          }
                                    </div>
                        </div>
                  )
                })}
            </div>
            {
            showEmojiPicker && 
            <div>  
                  <EmojiPicker onEmojiClick={
                        (eventObject) => {
                            setMessage(message+eventObject.emoji)
                        }
                  }></EmojiPicker>
            </div>
            }
                      <div className="send-message-div">
                               <input 
                               style={{border: '1px solid #e74c3c', outline: 'none'}}
                                type="text"
                                className="send-message-input"
                                placeholder="Type a message..." 
                                onChange={ handleMessageChange }
                                ref = { inputRef }
                                onKeyDown={ handleOnKeyDown }
                                onFocus={
                                    ()=>{
                                      if(showEmojiPicker) updateEmojiPicker(!showEmojiPicker)
                                     }
                                }
                                value = {message} />
                           <button onClick={sendMsg} type="button" className="fa fa-paper-plane send-message-btn"></button>
                           
                           <button onClick={()=>{
                              updateEmojiPicker(!showEmojiPicker)
                           }} type="button" className="fa fa-smile-o send-emoji-btn"></button>
                      </div>
        </div>
    </>
  )
}

export default ChatArea;
