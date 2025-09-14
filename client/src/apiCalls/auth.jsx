import axiosInstance from './index.jsx';

/*
 REJECTED PROMISE ONLY:
   1. if you throw error from your catch block. and it also needs first control comes to catch block
   2. You dont use try-catch and make api request and promise is rejected.
   Then the rejected promise is returned back to caller.
   
*/


const signupUser = async (user) => {
   
      try{
         let response = await axiosInstance.post('/api/auth/signup', user);
         return response.data;

      }catch(err) {
         return err;
      }
}


const loginUser = async (user) => {

      try {
         let response = await axiosInstance.post('/api/auth/login', user);
         return response.data;

      } catch (error) {         
         return error;  
   }
};

export { signupUser, loginUser };

