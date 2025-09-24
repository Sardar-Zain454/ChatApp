import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


let useConnectionHandler = () => {


    let [internetStatus, updateInternetStatus] = useState(navigator.onLine);

    useEffect(()=> {
            // whenever the componenet is routed or  true happens

            function onlineHandler() {
                    updateInternetStatus(true);
            }

            function offlineHandler() {
                    updateInternetStatus(false);
                    // empty the array of online users here.
            }



            window.addEventListener('online',  onlineHandler);
            window.addEventListener('offline', offlineHandler);



        return () => {
            // whenever the componenet is un routed or false happens
            window.removeEventListener('online', onlineHandler);
            window.removeEventListener('offline', offlineHandler);
        }
    }, []);
      
    return internetStatus;
}

export default useConnectionHandler;