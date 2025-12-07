import axiosInstance from './index.jsx';



let getAllChats = async () => {

     
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

const clearingMessages = async ( chatId ) => {
           try {
            const response = await axiosInstance.post('/api/chat/clear-unread-messages', { chatId }); // if it is a simple variable then must {} otherwise if it is an object then no need of it {} ok naa!
            return response.data;
        }catch(err) {
              return err;
           }
}


export { getAllChats, createNewChat, clearingMessages };