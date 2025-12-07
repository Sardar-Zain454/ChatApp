import { useEffect, useState } from "react";
import Header from "./components/header.jsx";
import Sidebar from "./components/sidebar.jsx";
import { useSelector } from "react-redux";
import ChatArea from './components/ChatArea.jsx';
import { io } from 'socket.io-client';
import { updateOnlineUsers, setAllChats, setAllUsers, setUser } from "../../redux/userSlice.jsx";
import { useDispatch } from "react-redux";
import store from "../../redux/store.jsx";
import { timeFormatter } from "./components/userList.jsx";

  // that socket represent the connected client process at frontend which is connected to backend process.
  const socket = io('http://localhost:5000'); // connection request from backend if backend accept then that client is registered
// and on frontend 'connect' is raised.

// first ProtectedRoute will fetch the currently logged in user details if token is available in localStorage and if any error
// came during that i will redirect the user to the login page /login and after that it will update the global store of userSlice
// then it will render the children components which is this Home component

// WHEN HOME IS MOUNTED/RENDERED CURRENT USERS AND ALL USERS ARE SUCCESSFULLY POPULATED.
export function emitRelevantEvent(user, user2, disconnectTheSocket) {
    // both (user, user2) are the logged in user.
    if(user)
        socket?.emit('profile_picture_broadcast', { dp: user?.profilePic, userId: user?._id, publicId: user?.publicId } );
    if(user2)
        socket?.emit('delete_profile_picture_broadcast', { dp: user2?.profilePic, userId: user2?._id, publicId: user2?.publicId } );
    if(disconnectTheSocket) 
        socket.disconnect();
  
}

let Home = () => {
        let { user, selectedChat } = useSelector(state => state.userReducer); 
        let dispatcher = useDispatch();

    useEffect(() => {
        socket.emit('join-chat-room', user._id);

// ------------------------------------------------------------------------------------------------------------
//  socket.off('reconnect').on('reconnect', () => {
//                             // socket.emit('join-chat-room', user._id);
//                             console.log("HAN G BAHI GG KUA CHAL RAH CHARSSS CHAL RAHI HY NAH");
//                 })
// --------------------------------------------------------------------------------------------------------

// if you use online-users in any other component then that is off when that below event is stricked.
        socket.off('online-users').on('online-users' , (usersWhoAreOnline, userId, state) => {
            // userId = the user who is going offline or going online,
            // state = that user state it may be on(online), off(offline)
            dispatcher(updateOnlineUsers(usersWhoAreOnline));

            let {
                user: currentlyLoggedInUser,
                allUsers,
                allChats,
                selectedChat: activeChat } = store?.getState()?.userReducer;


                // Not for event emitter person who is getting online now:
                 if(userId !== currentlyLoggedInUser?._id) {
                  // 1. Updating that user from the list of the user. mandatory he exists there.
                        let updatedUsers = allUsers?.map((user) => {
                            if(user._id === userId) {
                                return {
                                    ...user,
                                     lastseen: state === "on" ? "online" : new Date().toISOString()
                                }
                            }
                            return user;
                        });
                    

                // 2. Updating that user from the list of the chats if exists there.
                     let updatedChats =  allChats?.map((chat) => {
                             let chatMembers = chat?.members?.map((member) => {

                                if(member?._id === userId) {
                                
                                let flag = activeChat?._id === chat._id;

                                if(state === "on" && flag) {
                                       let element = document.getElementById('online_status');
                                       element.innerText = "online";
                                } 

                                if(state === "off" && flag) {
                                       let element = document.getElementById('online_status');
                                       element.innerText = timeFormatter(Date.now());
                                } 
                                

                                   return {
                                    ...member,
                                     lastseen: state === "on" ? "online" : new Date().toISOString()
                                   }
                                }
                    
                                return member;
                             });
                            
                        return { ...chat, members: chatMembers }
            });

            dispatcher(setAllChats(updatedChats));
            dispatcher(setAllUsers(updatedUsers));

        } else { 
            //  For the event emitter person who is getting online now: for state="off" this else is not executed at all.
            let updatedUser = { 
                ...currentlyLoggedInUser, 
                // this else part is only executed when user is offline so that 
                // that else part is not executed. thats why it commented above code
                // lastseen: state === "on" ? "online" : new Date().toISOString() 
                lastseen: "online"
            }

            // mery related jo chats ayi unn ma bi mainn hon na right
                let updatedChats =  allChats?.map((chat) => {
                             let chatMembers = chat?.members?.map((member) => {
                                if(member?._id === userId) {
                                   return {
                                    ...member, 

                                    // lastseen: state === "on" ? "online" : new Date().toISOString()
                                    // this else part is only executed when user is offline so that 
                                    // that else part is not executed. thats why it commented above code

                                     lastseen: "online"
                                }
                                }
                    
                                return member;
                             });
                            
                        return { ...chat, members: chatMembers }
            });


             dispatcher(setUser(updatedUser));
            dispatcher(setAllChats(updatedChats));
        }
});
// ----------------------------------------------------------------------------------------------------------------

    // // when user is again log-in and selected of its is open.
    //             socket.off('i_am_online_boys').on('i_am_online_boys', (userId) => {
    //                 // Note: here users dont update frontend of other users as well as its own backend that i am online
    //                 // but when he is offline will do this.
    //                         let selectedChatCopy = store?.getState()?.userReducer?.selectedChat;
    //                         if(!selectedChatCopy) return;
    //                         let amIOnline = selectedChatCopy?.members?.map(member => member?._id).includes(userId);
    //                         if(amIOnline) {
    //                                 document.getElementById('login_status').innerText = "online";
    //                         }
    //                 });
                socket.off('profile_picture_multicast').on('profile_picture_multicast', (details) => {

                let { user: currentlyLoggedInUser, allUsers, allChats } = store?.getState()?.userReducer;

                    if(details?.userId !== currentlyLoggedInUser?._id) {
                        // updating that  user from list of users:
                        let updatedUsers = allUsers?.map((user) => {
                            if(user._id === details.userId) {
                                return {
                                    ...user, profilePic: details.dp, publicId: details?.publicId
                                }
                            }
                            return user;
                        });

                        // updating that user from list of chats
                        let updatedChats =  allChats?.map((chat) => {
                             let chatMembers = chat?.members?.map((member) => {
                                if(member?._id === details?.userId) {
                                   return {
                                    ...member, profilePic: details?.dp, publicId: details?.publicId
                                   }
                                }

                                return member;
                             });

                        return { ...chat, members: chatMembers }
                        })


                dispatcher(setAllChats(updatedChats));
                dispatcher(setAllUsers(updatedUsers));
        }
    });


}, []);

    return (
        <div className="home-page">
             <Header socket = {socket} ></Header>
                <div className="main-content">
                    <Sidebar socket = { socket }></Sidebar>
                    { selectedChat && <ChatArea socket = { socket } /> }
                </div>
        </div>
    );
}
export default Home;

    // let {user, allUsers, allChats, selectedChat} = useSelector(state => state.userReducer); 
 
    // console.log(user, allUsers, allChats);
    // useEffect(()=>{
    //     console.log("CURRENT USER: ", user);
    //     console.log("ALL USERS: ", allUsers);
    //     console.log("ALL CHATS: ", allChats);
    // }, []);

