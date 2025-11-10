import axiosInstance from './index.jsx';


let getLoggedUser = async () => {

     try { 
            let response = await axiosInstance.get('/api/user/get-logged-user');
            return response.data;

     } catch (err) {
          return err; 
     }
}

let getAllUsers = async () => {

    try {
           const response = await axiosInstance.get('/api/user/get-all-users')
           return response.data; 

    } catch (err) {
           return err;
    }
}


let uploadProfilePic = async (image) => {
       try {
         const response = await axiosInstance.post('/api/user/upload-profile-pic', {image});
         return response.data; // json object {}
       } catch(err) {
              return err;
       }
}

export { getLoggedUser, getAllUsers, uploadProfilePic };