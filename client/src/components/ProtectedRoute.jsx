
import React, { useEffect, useState } from 'react';
import  { useNavigate } from 'react-router-dom';
import { getLoggedUser } from '../apiCalls/user.jsx';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { showLoader, hideLoader } from '../redux/loaderSlice.jsx';
import { setUser, setAllUsers } from '../redux/userSlice.jsx';
import { getAllUsers } from '../apiCalls/user.jsx'; // custom name

  let ProtectedRoute = ( {children} ) => {


       let navigate = useNavigate();
       const {user, allUsers} = useSelector(state => state.userReducer); // this is my durbeen 
       let dispatcher = useDispatch();


       async function getUserDetails() {
         
          
           let response = null;

          try {
               dispatcher(showLoader());
                response = await getLoggedUser();
               dispatcher(hideLoader());


               if(response.success) {
                    toast.success(response.message);
                    dispatcher(setUser(response.data)); // action: {type: user/setUser, payload: {firstname: '', lastname: '', ...}}

               } else {
                     toast.error(response.message);
                     navigate('/login');
               }
          } catch (err) {
               response.message = response.message || 'Something went wrong while data getting user details'; //runs or works for only if above signupUser() calls causes some error.
               toast.error(response.message);
               navigate('/login');
               dispatcher(hideLoader());

          }
      }


      async function getAllUsersfromDB() {
          let response = null;

          try {
                dispatcher(showLoader());
                response = await getAllUsers();
               dispatcher(hideLoader());


               if(response.success) {
                    toast.success(response.message);
                    dispatcher(setAllUsers(response.data)); // action: {type: user/setAllUsers, payload: [{user1}, {user2},....{userN}]}

               } else {
                     toast.error(response.message);
                     navigate('/login');
               }

          } catch (err) {
               response.message = response.message || 'Something went wrong while data getting all the users'; //runs or works for only if above signupUser() calls causes some error.
               toast.error(response.message);
               navigate('/login');
               dispatcher(hideLoader());
          }
      }

     useEffect(()=>{
        if(localStorage.getItem('token')) {
               getUserDetails();
               getAllUsersfromDB();
        } else {
           navigate('/login');
        }
     }, []);

         // JSX RETURNED FIRST BEFORE THE API CALL IS DONE AND RESOLVED BECAUSE USEFFECT RUNS AFTER THE COMPONENET IS MOUNTED INTO AND JSX IS PROPERLY RETURNED
       return (
          <div>
               {/* THIS MAKES SURE THAT BOTH CURRENTLY LOGGED IN USER AND ALL OTHERS USERS EXCEPT LOGGED IN USERS FIRST FETCH
                 THEN IT WILL SHOW OR MOUNT HOME COMPONENT AND ITS DESCENDANTS TO MAKE SURE THERE IS NO NULL POINTER EXCEPTION IF
                 HOME OR ITS CHILD ACCESSES THE STORE BEFORE IT IS POPULATED.
               */}
            {/* {user && allUsers.length ? children : <></>} */}
            {user && allUsers.length && children}
          </div>

          /*
            <div>
              {children}
            </div> 
             In that sense all child components of home component must use ?. optional chaining operator to access user object property 
             Because if user is null or undefined then it will throw error if we try to access user.firstname or user.lastname 
             eg: null.firstname or undefined.lastname will throw Null pointer exception or TypeError: cannot read properties of null.
             this happens only if api call fails or update the user inside redux store after home component childs use that store now you get.
             So above we make sure that first api call is resolved user in redux store is populated then only we render the children home compoenet
             so that all the child component of home componenet can access user objet properties without any error. like null pointer exception etc.
          */
       )
     
  }


  export default ProtectedRoute;