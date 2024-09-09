import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/adminSlice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }
      const res = await axiosInstance.post("/admin/signin", {username, password});
      dispatch(loginSuccess(res.data));
      navigate('/');
    } catch(err) {
      dispatch(loginFailure());
      setError(err.response ? err.response.data.message : err.message);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-blue-900 pt-20 px-4">
      <div className="w-full max-w-xl bg-white px-16 py-10 rounded-2xl shadow-custom-dark">
        <h2 className="text-3xl font-sf-bold text-blue-800 mb-6 text-center">Sign in as Admin to ENSAYO</h2>
        {error && <div className="text-red-500 text-center mb-4 font-sf-regular">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-600 font-sf-regular mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="w-full p-2 border border-gray-400 rounded-md font-sf-regular"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-600 font-sf-regular mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-full p-2 border border-gray-400 rounded-md font-sf-regular"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-700 text-white font-sf-light py-2 px-8 rounded-full focus:outline-none focus:shadow-outline"
            >
              Log in
            </button>
          </div>
          <div className="text-center mt-5">
            <Link to="/admin/register" className="text-blue-800 hover:text-blue-600 font-sf-regular">No account yet? Create new account ↗</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
