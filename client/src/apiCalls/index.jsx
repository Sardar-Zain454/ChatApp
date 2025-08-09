import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000, 
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`
    }
});



function requestSuccess(request) {
    const token = localStorage.getItem('token');
    if(token) request.headers['authorization'] = `Bearer ${localStorage.getItem('token')}`;
    return request; // make sure request goes to next stack like backend
    // try block -- backend
}


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
      // try block to previous try block
}

// before control going to respective first come here in case of any error
function responseError(error) {
  // Runs for any 3xx, 4xx, 5xx or any network, cors any error controls come there
  
  let msg = error.response?.data?.message;
  if(error.code === "ECONNABORTED") msg = "Request timeout!";
   

    error.success = false;
    error.message =  msg || error.message;

    return Promise.reject(error); // make sure the api request relevant catch block executes. and there you return error to your frontend code where it also handled.
}







// Attaching request interceptors to axiosInstance.
axiosInstance.interceptors.request.use(requestSuccess, requestError);

// Attaching response interceptors to axiosInstance.
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