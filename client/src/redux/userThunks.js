
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getLoggedUser, getAllUsers, uploadProfilePic } from './../apiCalls/user.jsx';
import { loginUser, signupUser,  } from '../apiCalls/auth.jsx';
import { getAllChats, clearingMessages } from '../apiCalls/chat.jsx';
import { createNewMessage, fetchAllMessages } from "../apiCalls/message.jsx";

import toast from 'react-hot-toast';


const signupThunk = createAsyncThunk('user/signupThunk', async (user, { rejectWithValue } ) => {

   let response = null;

   try {
         response = await signupUser(user);

         if(response.success) {
               toast.success(response.message);
               return response;
         } else {
               toast.error(response.message); // backend api failure
               return rejectWithValue(response.message);
         }
   } catch(error) {
      // frontend api crash
      toast.error("Something went wrong while Sign up!")
         return rejectWithValue(error.message);
   }

});


const loginThunk = createAsyncThunk('user/loginThunk', async (user, { rejectWithValue }) => {

   let response = null;

   try {
      response = await loginUser(user);

      if (response.success) {
         // toast.success(response.message); // this best suits in initual data fetch comppoenet after data is fetch
         return response.token;
      } else {
         toast.error(response.message)
         return rejectWithValue(response.message); // backend api failure msg
      }
   } catch (error) {
      toast.error("Something went wrong while login!")
      return rejectWithValue(error.message); // frontend above line 13 api failure msg apo crash
   }
});


const fetchUserThunk = createAsyncThunk('user/fetchUserThunk', async (navigate, { rejectWithValue }) => {

   let response = null;

   try {

      response = await getLoggedUser();

      if (response.success) {
         // action.type = user/fetchUser/fulfilled of that particular thunk
         // action.payload = response (valid data reponse)
         //    toast.success(response.message);
         return response.data;
      } else {

         // ❌ Case 2: API responded but failed
            toast.error(response.message)
         navigate('/login');
         // action.type = user/fetchUser/rejected of that particular thunk
         // action.payload = response (error response error came from response error interceptor)
         //  return rejectWithValue(response); when you want you can access all information of that error also
         return rejectWithValue(response.message); // backend api failure msg
      }

   } catch (error) {
      // ❌ Case 3: API promise crashes / throws above line 12
      // here only control came if line 12  response = await getLoggedUser(); crashes because i handle promise in that funciton
         toast.error('Something went wrong while fetching user details');
      navigate('/login');
      // action.type = user/fetchUser/rejected of that respected thunk.
      // action.payload = error (that above catch error object);
      //   return rejectWithValue(error); wen you want you can access all information of that error also
      return rejectWithValue(error.message); // frontend api crash message above line 49

   }

});



const fetchAllUsersThunk = createAsyncThunk('user/fetchAllUsersThunk', async (navigate, { rejectWithValue }) => {

   let response = null;

   try {
      response = await getAllUsers();

      if (response.success) {
         //   toast.success(response.message);
         return response.data;
      } else {
          toast.error(response.message);
         navigate('/login');
         return rejectWithValue(response.message) // backend api failure msg
      }

   } catch (error) {
         toast.error("Something went wrong while fetching all other users details"); 
      navigate('/login');
      return rejectWithValue(error.message); // frontend api crash message above line 86 error

   }
});




const fetchAllChatsThunk = createAsyncThunk('user/fetchAllChatsThunk', async (navigate, { rejectWithValue }) => {

   let response = null;
   try {
      response = await getAllChats();

      if (response.success) {
         //  toast.success(response.message);
         return response.data;
      } else {
         navigate('/login');
          toast.error(response.message);
         return rejectWithValue(response.message) // backend api failure message
      }

   } catch (error) {
        toast.error("Something went wrong while fetching related user chats");
      navigate('/login');
      return rejectWithValue(error.message); // frontend api crash message above line 113 error
   }
});


 const sendMessageThunk = createAsyncThunk('user/sendMessage', async (message, { rejectWithValue }) => {
     let response = null;

   try {
       response = await createNewMessage(message);

       if(response.success) {
         //  toast.success(response.message);
           return response.data;
       } else {
         toast.error(response.message);
         return rejectWithValue(response.message) // backend api failure message
       }
   }catch(err) {
        toast.error("Something went wrong while sending the message");
      return rejectWithValue(error.message); // frontend api crash message above line 113 error
   }
 });

 const fetchAllMessagesThunk = createAsyncThunk('user/fetchAllMessagesThunk',  async (chatId, { rejectWithValue }) => {
     let response = null;

   try {
       response = await fetchAllMessages(chatId);
       if(response.success) {
         //  toast.success(response.message);
           return response.data;
       } else {
         toast.error(response.message);
         return rejectWithValue(response.message) // backend api failure message
       }
   }catch(err) {
        toast.error("Something went wrong while sending the message");
      return rejectWithValue(error.message); // frontend api crash message above line 113 error
   }
 });

  const clearAllMessagesThunk = createAsyncThunk('user/clearAllMessages',  async (chatId, { rejectWithValue } ) => {
     let response = null;

   try {
       response = await clearingMessages(chatId);
       if(response.success) {
         //  toast.success(response.message);
           return response.data; 
       } else {
            toast.error(response.message);
            return rejectWithValue(response.message) // backend api failure message
       }
   }catch(err) {
        toast.error("Something went wrong while sending the message");
         return rejectWithValue(error.message); // frontend api crash message above line 113 error
   }
 });

 const uploadProfilePicThunk = createAsyncThunk('user/uploadProfilePic', async (imageString, { rejectWithValue }) => {
       let response = null;
       try {
          response = await uploadProfilePic(imageString); // failure there leads to catch which is below.
          if(response.success) {
            //  toast.success(response.message);
              return response.data; // return data: user to the caller
          } else {
               toast.error(response.message);
               return rejectWithValue(response.message); // backend api failure
          }
       } catch (err) {
              toast.error("Something went wrong while uploading the profile picture");
              return rejectWithValue(error.message); // frontend api crash
       }
 });


export {
   loginThunk,
   fetchUserThunk,
   fetchAllUsersThunk,
   fetchAllChatsThunk,
   signupThunk,
   sendMessageThunk,
   fetchAllMessagesThunk,
   clearAllMessagesThunk,
   uploadProfilePicThunk
};