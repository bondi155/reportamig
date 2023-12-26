
import { Navigate } from "react-router-dom";
import React from 'react';


const PrivateRoute = ({ islogin, children }) => {
   if (!islogin) {
    return <Navigate to="/"/>;
    
} 
return children;


};
export default PrivateRoute;