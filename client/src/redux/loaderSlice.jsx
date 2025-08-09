import { createSlice } from '@reduxjs/toolkit';

 let loaderSlice = createSlice({

    name: 'loader',
    initialState: {
        value: false
    },

    reducers: {
        showLoader: (state, action) => {
               state.value = true;
        },
        hideLoader: (state, action) => {
              state.value = false;
        }
    }
 });

 export const {showLoader, hideLoader} = loaderSlice.actions; // state updater functions. 
 export default loaderSlice.reducer; //  // this represents the initialValue object of pertinent slice like initial value object 


