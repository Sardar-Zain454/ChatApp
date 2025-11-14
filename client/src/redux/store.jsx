 import { configureStore } from '@reduxjs/toolkit';
 import loaderReducer from './loaderSlice.jsx'; // this represents the initialValue object of pertinent slice
 import userReducer from './userSlice.jsx';

 let store = configureStore({
       reducer: {
            loaderReducer: loaderReducer, // contains initialValue object of its state
            userReducer: userReducer, // contains the initialValue object of its state
      } ,
  
 });

 export default store;