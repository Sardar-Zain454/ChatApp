import axiosInstance from './index.jsx';




const signupUser = async (user) => {

     if(!navigator.onLine) {
         return {success: false, message: "You are offline!"};
     }


      try{
         let response = await axiosInstance.post('/api/auth/signup', user);
         console.log("HEREREREREREr");
         return response.data;

      }catch(err) {
         return err;
      }
}


const loginUser = async (user) => {

      if(!navigator.onLine) {
         return {success: false, message: "You are offline!"};
      } 

      try {
         let response = await axiosInstance.post('/api/auth/login', user);
         return response.data;

      } catch (error) {
         return error;  
   }
};

export {signupUser, loginUser};

