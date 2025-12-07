import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { hideLoader } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import { updateOnlineUsers } from "../redux/userSlice";
import { emitRelevantEvent } from "../pages/home";

let useConnectionHandler = () => {


    let [internetStatus, updateInternetStatus] = useState(navigator.onLine);
    let dispatcher = useDispatch();

    useEffect(()=> {
            // whenever the componenet is routed or  true happens
            function onlineHandler() {
                // below offlineHandler handles offline things at client and for that backend disconnect auto handles its backend right
                // for online like this function we emit 'reconnect' event from home component and its backend handles approptrialey right.
                updateInternetStatus(true);
            }

            function offlineHandler() {
                    dispatcher(hideLoader()); // if api call is in action and internet goes then stop that UI right now
                    updateInternetStatus(false);
                    dispatcher(updateOnlineUsers({})); // when internet goes no user swill be seen online on that machine.
                    let onlineElement = document.getElementById("online_status");

                    if(onlineElement) {
                        // when you are in profile component or when any chat is not selected then this is not in dom.
                        // that's why if put if check there
                        document.getElementById("online_status").innerText = "";
                    }
                    // empty the array of online users here.
                    // NOTE:
                    // bahi yahan pr is user ki redux state ma jo user property hy usma bi offline(timeStamp) and 
                    // allChats ma jo ya hy udr bi 'offline'(timestamp) krdo wohi simple saa hy jo tum ny udr show kiya hua
                    // home Component ma right
            }



            window.addEventListener('online',  onlineHandler);
            window.addEventListener('offline', offlineHandler);



        return () => {
            // whenever the componenet is un routed (unmounted!) or false happens.
            window.removeEventListener('online', onlineHandler);
            window.removeEventListener('offline', offlineHandler);
        }
    }, []);
      
    return internetStatus;
}

export default useConnectionHandler;