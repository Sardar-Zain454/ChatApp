import { useEffect } from "react";
import Header from "./components/header.jsx";
import Sidebar from "./components/sidebar.jsx";
import { useSelector } from "react-redux";
import ChatArea from './components/ChatArea.jsx';
import { io } from 'socket.io-client';

  // that socket represent the connected client process at frontend which is connected to backend process.
    const socket = io('http://localhost:5000'); // connection request from backend if backend accept then that client is registered
// and on frontend 'connect' is raised.

// first ProtectedRoute will fetch the currently logged in user details if token is available in localStorage and if any error
// came during that i will redirect the user to the login page /login and after that it will update the global store of userSlice
// then it will render the children components which is this Home component

// WHEN HOME IS MOUNTED/RENDERED CURRENT USERS AND ALL USERS ARE SUCCESSFULLY POPULATED.
let Home = () => {
        let { user, selectedChat } = useSelector(state => state.userReducer); 
        // Observe teh division of home component.

      
        // here we only do some general things like making a single connection socket and put that socket in a room at backend
        // now we have to pass that socket into the different
        useEffect(() => {
                     socket.emit('join-chat-room', user._id);
                    // socket.emit('join-chat-room', 'buray-all-itehad');

            }, []);

    return (
        <div className="home-page">
             <Header></Header>
                <div className="main-content">
                    <Sidebar></Sidebar>
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