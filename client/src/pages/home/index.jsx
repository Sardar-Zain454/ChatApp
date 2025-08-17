import { useEffect } from "react";
import Header from "./components/header.jsx";
import Sidebar from "./components/sidebar.jsx";
import { useSelector } from "react-redux";
import ChatArea from './components/ChatArea.jsx';

// first ProtectedRoute will fetch the currently logged in user details if token is available in localStorage and if any error
// came during that i will redirect the user to the login page /login and after that it will update the global store of userSlice
// then it will render the children components which is this Home component

// WHEN HOME IS MOUNTED/RENDERED CURRENT USERS AND ALL USERS ARE SUCCESSFULLY POPULATED.
let Home = () => {

    let {user, allUsers, allChats} = useSelector(state => state.userReducer); 

    useEffect(()=>{
        console.log("CURRENT USER: ", user);
        console.log("ALL USERS: ", allUsers);
        console.log("ALL CHATS: ", allChats);
    }, []);

    return (
        <div className="home-page">
             <Header />
            <div className="main-content">
                <Sidebar></Sidebar>
                 <ChatArea />
            </div>
        </div>
    );
}

export default Home;