

  // Please review LoadInitialData file for much information


                                   // HIGHLY FOCUSED AND SINGLE RESPONSIBILITY BASED PROTECTED ROUTE.
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

// Will handle frontend authentication and authorization.....
const ProtectedRoute = () => { 
   const token = localStorage.getItem('token');
   return (
      <>
        { (token && token !== 'undefined') ? <Outlet /> : <Navigate to="/login"/> }
      </>
   )

}

export default ProtectedRoute