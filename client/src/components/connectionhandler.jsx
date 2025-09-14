import { useEffect, useState } from "react";


let useConnectionHandler = () => {


    let [internetStatus, updateInternetStatus] = useState(navigator.onLine);

    useEffect(()=> {
            // whenever the componenet is routed or  true happens

            function onlineHandler() {
              // refach the data again 
              updateInternetStatus(true);
            }

            function offlineHandler() {
                updateInternetStatus(false);
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