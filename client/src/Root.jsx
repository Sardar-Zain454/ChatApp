import React from 'react'
import App from './App'
import useConnectionHandler from './components/connectionhandler'
import toast from 'react-hot-toast';
// import toast from 'react-hot-toast';


function showInternetStatus(status) {

        setTimeout(()=>{
            if(status) toast.success('Internet connected 🙌🏿');
            else toast.error("Please check your connection 😔");
        }, 300);
      
}


const Root = () => {    
  // i use it here not in app because when the app re-render like due to loader this custom hook runs again give me new result
  // and it show the status again thats why i put it there you can also put loader in request interceptor so avoid it so 
  // will be able to put this loader in your app.
    let isInternetConnected = useConnectionHandler(); // first gets the result from that custom hook then goes below
  return (
    <>
    {isInternetConnected ? showInternetStatus(1) : showInternetStatus(0)}
     <App />
    </>
  )
}

export default Root;