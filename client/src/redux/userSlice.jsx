
import { createSlice} from '@reduxjs/toolkit';
import { 
   loginThunk,
    fetchUserThunk,
     fetchAllUsersThunk,
      fetchAllChatsThunk,
      signupThunk,
      sendMessageThunk,
      fetchAllMessagesThunk,
         clearAllMessagesThunk
   } from './userThunks.js';
import { showLoader, hideLoader } from './loaderSlice.jsx';

 const initialState = {
        user: null, // currently logged in user ==> {}
         allUsers: null, // all users in the system except the currently logged in user ==> []
         allChats: null, // all chats for currently logged in user ==> []
         selectedChat: null, // chat which is currently selected by the user ==> {}
         messages: null, // all messages for the selected chat ===> []
         fetchInitialData: false
 }


let userSlice = createSlice({

   name: 'user',
   initialState: initialState,

    reducers: { // contains stte updater functions

       addMessage: (state, action) => {
             state.messages = [...state.messages, action.payload];
       },

         setUser: (state, action) => {
            state.user = action.payload;
         },

         setAllUsers: (state, action) => {
            state.allUsers = action.payload;
         },

         setAllChats: (state, action) => { // all chats in which the currently logged in user is a participant
            state.allChats = action.payload;
         }, 

         setSelectedChat: (state, action) => {
             state.selectedChat = action.payload;
         },

         updateInitialDataFetched: (state, action) => {
            state.fetchInitialData = action.payload
         }
   },

   // thunks for fetching the data
   extraReducers: (builder) => {


      builder
         .addCase(signupThunk.fulfilled, (state, action) => {
            // state.loader = false;
         })
         .addCase(signupThunk.pending, (state, action) => {
            // state.loader = true;
         })
         .addCase(signupThunk.rejected, (state, action) => {
            // state.loader = false;
         })
      builder
         .addCase(loginThunk.fulfilled, (state, action) => {
            localStorage.setItem('token', action.payload);
            // state.loader = false;
         })
         .addCase(loginThunk.pending, (state, action) => {
            // state.loader = true;
         })
         .addCase(loginThunk.rejected, (state, action) => {
            // state.loader = false;
         })
      // for login of logged in user.



      // for fetching the currently logged in user. This runs only if token exists
      builder
         .addCase(fetchUserThunk.fulfilled, (state, action) => {
             state.user = action.payload; // api response data
            //  state.loader = false;
         })
         .addCase(fetchUserThunk.pending, (state, action) => {
            // state.loader = true;
         })
         .addCase(fetchUserThunk.rejected, (state, action) => {
               // localStorage.clear();
               // state.loader = false;
         })

      // for fetching all the users except currently logged in user.
      builder
         .addCase(fetchAllUsersThunk.fulfilled, (state, action) => {
               state.allUsers = action.payload;
               // state.loader = false;
         })
         .addCase(fetchAllUsersThunk.pending, (state, action) => {
               // state.loader = true;
         })
         .addCase(fetchAllUsersThunk.rejected, (state, action) => {
               // state.user = null;
               // localStorage.clear();
               // state.loader = false;
         })

      // // for fetching all the chats in which our currently logged user is involved.
      builder
         .addCase(fetchAllChatsThunk.fulfilled, (state, action) => {
            state.allChats = action.payload;
            // state.loader = false;
         })
         .addCase(fetchAllChatsThunk.pending, (state, action) => {
            //  state.loader = true;
         })
         .addCase(fetchAllChatsThunk.rejected, (state, action) => {
            state.messages = null;
            // state.user = null;
            // state.allUsers = null;
            // localStorage.clear();
            // state.loader = false;
         })

         builder
         .addCase(sendMessageThunk.fulfilled, (state, action) => {
            // state.allChats = action.payload;
         })
         .addCase(sendMessageThunk.pending, (state, action) => {

         })
         .addCase(sendMessageThunk.rejected, (state, action) => {

         });

         builder
         .addCase(fetchAllMessagesThunk.fulfilled, (state, action) => {
            state.messages = action.payload;
         })
         .addCase(fetchAllMessagesThunk.pending, (state, action) => {
            // state.messages = action.payload;
         })
         .addCase(fetchAllMessagesThunk.rejected, (state, action) => {
            // state.messages = action.payload;
         })

         builder
         .addCase(clearAllMessagesThunk.fulfilled, (state, action) => {
                           let chatIndex = state.allChats.findIndex(chat => chat._id === action.payload._id);
                           if(chatIndex != -1) {
                                state.allChats[chatIndex] = action.payload;
                           }
         })
         .addCase(clearAllMessagesThunk.pending, (state, action) => {
            // state.messages = action.payload;
         })
         .addCase(clearAllMessagesThunk.rejected, (state, action) => {
               // state.messages = action.payload;
         })
   }
});

 export const { setUser, setAllUsers, setAllChats, setSelectedChat, updateInitialDataFetched, addMessage } = userSlice.actions; // state updater functions.
 export default userSlice.reducer; // this represents the initialValue object of pertinent slice like initial value object 
 
