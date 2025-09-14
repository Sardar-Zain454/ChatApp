
import { Toaster } from 'react-hot-toast';
import Loader from './components/loader.jsx';
import { useSelector } from 'react-redux';

import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/index.jsx';
import Login from './pages/login/index.jsx';
import Signup from './pages/signup/index.jsx';
import React from 'react';

import ProtectedRoute from './components/ProtectedRoute.jsx';
import FetchInitialData from './components/FetchInitialData.jsx';

let App = () => {

    const { value } = useSelector(state => state.loaderReducer); // state represent store variable in store.jsx and state.loaderReducer; represent pertinent initialValue (object) eventually this value injects to loader variable
    const { fetchInitialData } = useSelector(state => state.userReducer);

    

    return (
        <>
            <Toaster position="top-center" reverseOrder={false}/>
            {value && <Loader />}
            {fetchInitialData && <FetchInitialData />}
        <Routes>
            {/* public routes: */}
                <Route path="/login" element={<Login />}></Route>
                <Route path="/signup" element={<Signup/>}></Route>
                
                {/* private route: */}
            <Route  element ={<ProtectedRoute />}> 
                <Route path="/" element={<Home />}></Route>
            </Route>
            {/* <Route path="*" element={<Default />}></Route> */}
        </Routes>
    </>
    )
}

// on every re-render of root whenever the the connection status changes then it re-render the app and the child below this
// hierarchy gets re-render that why i do this
export default React.memo(App);



