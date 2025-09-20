
import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { sendMessageThunk, fetchAllMessagesThunk, clearAllMessagesThunk } from '../../../redux/userThunks';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../../redux/loaderSlice';
import dayjs from 'dayjs';
import { addMessage } from '../../../redux/userSlice';


 const ChatArea = ( { socket } ) => {

  let { selectedChat, user: loggedUser, messages} = useSelector(state => state.userReducer);
    let dispatcher = useDispatch();
    let[message, setMessage] = useState('');

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
    let now = dayjs(); // current date and time when that method is called for every message inside map function
    let messageTime = dayjs(timeStamp); // time when message was sent/created

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


   const sendMsg = async () => {
    if(message.trim() === '') return;

    let msg = {
              chatId: selectedChat._id,
              sender: loggedUser._id,
              text: message.trim(),
    }


      socket.emit('send-message', {
                  ...msg,
                  roomsToSendThatMessage: selectedChat.members.map(m => m._id),
                  read: false,
                  createdAt: dayjs()
      });

     await dispatcher(sendMessageThunk(msg));
    setMessage('');
  }

  const clearMessagesInDBAndFetchAllMessages = async () => {
      dispatcher(showLoader());
            if(selectedChat?.lastMessage?.sender !== loggedUser._id) {
                  await dispatcher(clearAllMessagesThunk(selectedChat._id));
                  // you can also update the selected chat here.
      }
            await dispatcher(fetchAllMessagesThunk(selectedChat._id));
      dispatcher(hideLoader());
}

            useEffect(() => {
                        clearMessagesInDBAndFetchAllMessages();

                        socket
                              .off('receive-message')
                              .on('receive-message', (incommingMessage) => {
                                    //  let allMessages = [...messages, incommingMessage ];
                                    dispatcher(addMessage(incommingMessage));
                              })
                              
            }, [selectedChat]);

  return (
    <>
        <div class="app-chat-area">
            <div class="app-chat-area-header">
                {getFullName()}
            </div>
            {/* All messages exist there below ... */}
            <div className='main-chat-area'>
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
                      <div className="send-message-div">

                               <input 
                                type="text"
                                className="send-message-input"
                                placeholder="Type a message..." 
                                onChange={(e)=>{setMessage(e.target.value)}}
                                value = {message} />
                           <button onClick={sendMsg} type="button" className="fa fa-paper-plane send-message-btn" aria-hidden="true"></button>
                    
                      </div>
        </div>
    </>
  )
}

export default ChatArea;
