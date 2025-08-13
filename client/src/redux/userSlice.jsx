
import { createSlice } from '@reduxjs/toolkit';

 let userSlice = createSlice({
    name: 'user',
    initialState: {
         user: null, allUsers: []
    },

    reducers: { // contains stte updater functions
         setUser: (state, action) => {
            state.user = action.payload;
         },

         setAllUsers: (state, action) => {
            state.allUsers = action.payload;
         }
    }
 });


 export const { setUser, setAllUsers } = userSlice.actions; // state updater functions.
 export default userSlice.reducer; // this represents the initialValue object of pertinent slice like initial value object 

