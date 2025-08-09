import axiosInstance from './index.jsx';


let getLoggedUser = async () => {

    if(!navigator.onLine) {
        return {success: false, message: "You are offline!"}
    }
       
     try { 
            let response = await axiosInstance.get('/api/user/get-logged-user');
            return response.data;

     } catch (err) {
          return err;
     }
}

export { getLoggedUser };