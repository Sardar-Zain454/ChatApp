import axiosInstance from './index.jsx';



let getAllChats = async () => {

    if(!navigator.onLine) {
        return {
            success: false,
            message: "You are offline."
        };
    }

    try {
      let response = await axiosInstance.get('/api/chat/get-all-chats');
      return response.data; //

    } catch (err) {
         return err;
    }
};


let createNewChat = async (newChat) => {

    if(!navigator.onLine) {
        return {
            success: false,
            message: "You are offline."
        }
    }

    try {
        const response = await axiosInstance.post(`/api/chat/create-new-chat`, newChat);
        return response.data;

    } catch (err) {
        return err;
    }

}


export { getAllChats, createNewChat };