import axios from 'axios';

const axiosInstance = axios.create({
    // baseURL: 'http://localhost:5000',
    baseURL: 'https://quick-chat-server-dt32.onrender.com',
    // timeout: 100, // if in 100 milliseconds the request doesnot completes whether fulfilled or rejected
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});



function requestSuccess(request) {

    if(!navigator.onLine) {
        // directly goes to the catch of respective api function from there it will go the respons thunk
        return Promise.reject({
            success: false,
            message: "No internet connection! 😔"
        })
    }


    const token = localStorage.getItem('token');
    if(token) request.headers['authorization'] = `Bearer ${token}`;
    return request; // make sure request goes to next stack like backend
    // try block --> backend
}

// invoke if requestSuccess causes some error or during axios configuring the request causes any error arises
function requestError(error) {

    error.success = false;
    error.message = "Request inetrceptor error";
    return Promise.reject(error);
   // now promise.reject(error) makes sure that request will not proceed to backend and control goes to catch of respected try of request method 
   // where "" and message are as i write it there.
}






function responseSuccess(response) {
    // Runs only for 2xx, this function executes.
      return response;
      // try block to/of cller,  previous try block
}

// before control going to respective first come here in case of any error
function responseError(error) {
  // Runs for any 3xx, 4xx, 5xx or any network, cors any error controls come there
  let msg = error?.response?.data?.message;
  if(error.code === "ECONNABORTED") msg = "Request timeout!";
  if(error.code === "ERR_NETWORK") msg = "CORS + DNS + No internet or server unreachable error"

//    console.log("Error in response interceptor", error);
   


    error.success = false; // causes code to return to else 
    error.message =  msg || error.message;

    return Promise.reject(error); // make sure the api request relevant catch block executes. and there you return error to your frontend code where it also handled.
}







// Attaching request interceptors to axiosInstance.
/*
    Once request is made, configuration (url, data, customConfigs) in axiosInstance happens and then control comes to request success 
    function and if everything is fine to that point and we return request object then request goes to backend server and if any error
    occurs in request configuration or in request success function then control goes to request error function and from there we return
    explict rejected promise ultimately control goes to catch block of the api call function where we can handle the rejected promise
    with proper messaging came from request error function. and return to the application code where it is called and then we 
    show the error message to user.

*/
axiosInstance.interceptors.request.use(requestSuccess, requestError);

// Attaching response interceptors to axiosInstance.





/*
   Once respnse received from backend then control comes to response success function if status code is 2xx and then control goes back
   to the api call try block where we can return this back to the application code where it is called and then store to the global redux
   store and if status code is not 2xx, or any network error, cors erro, timeout error then control comes to response error function
    and there we add extra fields to the error object and then we return the rejected promise so that the api call function catch block
    then it will go the application code where it is called and there we can handle the error messaging and show it to the user.
*/

axiosInstance.interceptors.response.use(responseSuccess, responseError);


export default axiosInstance;



/*
   documentation of above code:
Axios instance is created once with base URL and timeout.

Request interceptor:

Reads the latest token from localStorage before each request.

Ensures request.headers is updated.

Returns request so the chain proceeds.

Request error interceptor:

Adds success and message properties to error.

Rejects the promise so the request’s catch block executes.

Response interceptor:

Returns response for all 2xx status codes.

For errors, adds extra fields and rejects, so catch in request receives the modified error.

Flow is predictable:

On success → goes to .then() or try block and then goes response = back(frontend) or request = backend(server).

On failure → goes to .catch() or catch block. goes to frontend in request and response */