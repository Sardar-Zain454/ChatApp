
import React, { useEffect, useState } from 'react';
import  { useNavigate } from 'react-router-dom';
import { getLoggedUser } from '../apiCalls/user.jsx';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../redux/loaderSlice.jsx';
import { setUser } from '../redux/userSlice.jsx';

  let ProtectedRoute = ( {children} ) => {


       let navigate = useNavigate();
       let dispatcher = useDispatch();


       async function getUserDetails() {
         
          
           let response = null;

          try {
                           console.log("HELLO");
               dispatcher(showLoader());
                response = await getLoggedUser();
               dispatcher(hideLoader());


               if(response.success) {
                    console.log(response.data);
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

     useEffect(()=>{
        if(localStorage.getItem('token')) {
               getUserDetails();
        } else {
           navigate('/login');
        }
     }, []);


       return (
          <div>
            { children }
          </div>
       )
     
  }


  export default ProtectedRoute;