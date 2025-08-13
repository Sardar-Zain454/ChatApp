
import { createSlice } from '@reduxjs/toolkit';

let userSlice = createSlice({

   name: 'user',

   initialState: {
         user: null, // currently logged in user ==> {}
         allUsers: null, // all users in the system except the currently logged in user ==> []
         allChats: null // all chats for currently logged in user ==> []
   },

    reducers: { // contains stte updater functions

         setUser: (state, action) => {
            state.user = action.payload;
         },

         setAllUsers: (state, action) => {
            state.allUsers = action.payload;
         },

         setAllChats: (state, action) => {
            state.allChats = action.payload;
         }
   }
});

 export const { setUser, setAllUsers, setAllChats } = userSlice.actions; // state updater functions.
 export default userSlice.reducer; // this represents the initialValue object of pertinent slice like initial value object 

