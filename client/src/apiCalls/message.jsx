import axiosInstance from './index.jsx';


const createNewMessage = async ( message ) => {
    try {
        let response = await axiosInstance.post('/api/message/send-message', message);
        return response.data;
    }catch(err) {
        return err;
    }
}

const fetchAllMessages = async ( chatId ) => {
        try {
            let response = await axiosInstance.get(`/api/message/get-all-messages/${chatId}`, );
            return response.data;
        } catch(err) {
            return err;
        }

}

export { createNewMessage, fetchAllMessages };