import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
    const {currentAdmin} = useSelector(state=> state.admin)
    return currentAdmin ? children : <Navigate to="/admin/login" />
}

export default PrivateRoute
