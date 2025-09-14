import axiosInstance from './index.jsx';



let getAllChats = async () => {

     console.log("ALL CHATS");
     
    try {
      let response = await axiosInstance.get('/api/chat/get-all-chats');
      return response.data; //

    } catch (err) {
         return err;
    }
};


let createNewChat = async (newChat) => {

    try {
        const response = await axiosInstance.post(`/api/chat/create-new-chat`, newChat);
        return response.data;

    } catch (err) {
        return err;
    }

}


export { getAllChats, createNewChat };