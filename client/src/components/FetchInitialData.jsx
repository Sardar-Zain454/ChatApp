


  /*
                                3 Approaches to get the initial data
                a. fetch data in protected route but it makes that route less re-usable in beginning of chatapp
                b. fetch data in separate componeent after login navigate toward that or in redux make some state
                true to that component mounts just like loader here, and after fetching
                that component navigate towards home page. (used in smaller apps) protected route is now single responsibility
                c. create asyncThunk into that respected slice this for fetching intial data then navigate towards home
                 mostly used in redux apps.
  */



// import React, { useEffect, useState } from 'react';
// import  { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { useDispatch, useSelector } from 'react-redux';
// import { showLoader, hideLoader } from '../redux/loaderSlice.jsx';

// import { setUser, setAllUsers, setAllChats } from '../redux/userSlice.jsx';
// import { getAllUsers, getLoggedUser } from '../apiCalls/user.jsx'; 
// import { getAllChats } from '../apiCalls/chat.jsx'; 



// const LoadInitialData = () => {
//      let navigate = useNavigate();
//        const { user, allUsers, allChats } = useSelector(state => state.userReducer); // this is my durbeen 

//        let dispatcher = useDispatch();


//      async function getUserDetailsfromDB() {
         
          
//            let response = null;

//           try {
//                dispatcher(showLoader());
//                 response = await getLoggedUser();
//                dispatcher(hideLoader());


//                if(response.success) {
//                     toast.success(response.message);
//                     dispatcher(setUser(response.data)); // action: {type: user/setUser, payload: {firstname: '', lastname: '', ...}}

//                } else {
//                      toast.error(response.message);
//                      navigate('/login');
//                }
//           } catch (err) {
//                response.message = response.message || 'Something went wrong while data getting user details'; //runs or works for only if above signupUser() calls causes some error.
//                toast.error(response.message);
//                navigate('/login');
//                dispatcher(hideLoader());

//           }
//      }

//      async function getAllUsersfromDB() {
//           let response = null;

//           try {
//                 dispatcher(showLoader());
//                 response = await getAllUsers();
//                dispatcher(hideLoader());


//                if(response.success) {
//                     toast.success(response.message);
//                     dispatcher(setAllUsers(response.data)); // action: {type: user/setAllUsers, payload: [{user1}, {user2},....{userN}]}

//                } else {
//                      toast.error(response.message);
//                      navigate('/login');
//                }

//           } catch (err) {
//                response.message = response.message || 'Something went wrong while data getting all the users'; //runs or works for only if above signupUser() calls causes some error.
//                toast.error(response.message);
//                navigate('/login');
//                dispatcher(hideLoader());
//           }
//      }
//      async function getCurrentUserChatsFromDB() {
//              let response = null;

//           try {
//                 dispatcher(showLoader());
//                 response = await getAllChats();
//                dispatcher(hideLoader());


//                if(response.success) {
//                     toast.success(response.message);
//                     dispatcher(setAllChats(response.data)); // action: {type: user/setAllChats, payload: [{chat1}, {chat2},....{chatN}]}

//                } else {
//                      toast.error(response.message);
//                      navigate('/login');
//                }

//           } catch (err) {
//                response.message = response.message || 'Something went wrong while  getting chats data for current user.'; //runs or works for only if above signupUser() calls causes some error.
//                toast.error(response.message);
//                navigate('/login');
//                dispatcher(hideLoader());
//           }
//      }



//      useEffect(()=>{
//         if(localStorage.getItem('token')) {
//             console.log("I AM HERE");
//                getUserDetailsfromDB();
//                getAllUsersfromDB();
//                getCurrentUserChatsFromDB();

//         } else {
//            navigate('/login');
//         }
//      }, []);


//      function towardHome() {
//         navigate('/');
//      }

//          // JSX RETURNED FIRST BEFORE THE API CALL IS DONE AND RESOLVED BECAUSE USEFFECT RUNS AFTER THE COMPONENET IS MOUNTED INTO AND JSX IS PROPERLY RETURNED
//        return (
//           <div>
//                {/* THIS MAKES SURE THAT BOTH CURRENTLY LOGGED IN USER AND ALL OTHERS USERS EXCEPT LOGGED IN USERS FIRST FETCH
//                  THEN IT WILL SHOW OR MOUNT HOME COMPONENT AND ITS DESCENDANTS TO MAKE SURE THERE IS NO NULL POINTER EXCEPTION IF
//                  HOME OR ITS CHILD ACCESSES THE STORE BEFORE IT IS POPULATED.
//                */}
//             {/* {(user && allUsers && allChats) ? children : <></>} */}
//             {user && allUsers && allChats && towardHome()} {/* replacement of null,null,null with {},[],[] all these are truthy so children returns happily*/}
//           </div>

//           /*
//             <div>
//               {children}
//             </div> 
//              In that sense all child components of home component must use ?. optional chaining operator to access user object property 
//              Because if user is null or undefined then it will throw error if we try to access user.firstname or user.lastname 
//              eg: null.firstname or undefined.lastname will throw Null pointer exception or TypeError: cannot read properties of null.
//              this happens only if api call fails or update the user inside redux store after home component childs use that store now you get.
//              So above we make sure that first api call is resolved user in redux store is populated then only we render the children home compoenet
//              so that all the child component of home componenet can access user objet properties without any error. like null pointer exception etc.
//           */
//        )
// }

// export default LoadInitialData


/******************************************************************************************************************
                                            FETCHING THE INITIAL USER DATA
 ******************************************************************************************************************/

import { useEffect } from 'react';
import { fetchUserThunk, fetchAllChatsThunk, fetchAllUsersThunk } from '../redux/userThunks';
import { useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateInitialDataFetched } from '../redux/userSlice';
import { showLoader, hideLoader } from '../redux/loaderSlice';
import toast from 'react-hot-toast';


// one time use component.
const FetchInitialData = () => {

  

   let { user, allUsers, allChats } = useSelector(state => state.userReducer);

   let dispatcher = useDispatch();
   let navigate = useNavigate();


   async function fetchData() {    
        dispatcher(showLoader());
              await dispatcher(fetchUserThunk(navigate)); // no way that error comes her
              await dispatcher(fetchAllUsersThunk(navigate)); // no way that error comes her
              await dispatcher(fetchAllChatsThunk(navigate)); // no way that error comes her
        dispatcher(hideLoader());
   }


   // only for fetching initial data.
  useEffect(() => {
      fetchData();
  }, []);

  // here i think you get
  useEffect(() => {
      if(user && allUsers && allChats) {
        dispatcher(updateInitialDataFetched(false)); // this will trigger app to re-render again. use React.memo in its child if used.
        toast.success("Login successful");
        navigate('/'); 
      }
  }, [allChats]);


  return (<></>);
}

export default FetchInitialData;