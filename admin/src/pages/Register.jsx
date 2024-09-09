import React from 'react';
import { useState } from "react";
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/adminSlice.js";

const Register = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  const handleSignup = async (e) => {

    e.preventDefault();
    try {
      if (!username || !password || !email || !firstName || !lastName ) {
        setError("All fields are required");
        return;
      }

      if (username.length > 15) {
        setError('Username must be 15 characters or less');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('Username must only contain letters and numbers');
        return;
      }

      const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_+=])[0-9a-zA-Z!@#$%^&*()-_+=]{8,}$/;
      if (!passwordRegex.test(password)) {
        setError(
          'Invalid password'
        );
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }  

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Invalid email address');
        return;
      }

    const nameRegex = /^[a-zA-Z ,.-]{1,50}$/; // Allow only letters, period, and dash, up to 50 characters 
    if (!nameRegex.test(firstName)) {
      setError('Invalid first name');
      return;
    }

    if (!nameRegex.test(lastName)) {
      setError('Invalid last name');
      return;
    }


    const checkbox = document.getElementById('terms');
    if (!checkbox.checked) {
      setError("Please check the Data Privacy notice");
      return;
    }

      const res = await axiosInstance.post("/admin/signup", { username, password, email, firstName, lastName });
    
      dispatch(loginStart()); // Dispatch login start action
      const loginRes = await axiosInstance.post("/admin/signin", { username, password });
      dispatch(loginSuccess(loginRes.data)); // Dispatch login success action

      setUsername("");
      setPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");

      console.log("User successfully created");

      navigate('/');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        if (err.response.data.message === "Username already exists") {
          setError("Username already exists");
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError(err.message);
      }
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-blue-800 p-20 px-4">
      <div className="w-full max-w-2xl bg-white px-16 py-10 rounded-2xl shadow-custom-dark">
        <h2 className="text-3xl font-sf-bold text-blue-800 mb-6 text-center">Create an account</h2>
        <form>
          <div className="mb-6 flex items-center">
            <h3 className="text-2xl font-sf-bold text-blue-800 mr-4">Login Information</h3>
            <hr className="border-blue-800 border-t-2 w-full flex-1"/>
          </div>
          {error && (
            <div className="mb-4 flex justify-center">
              <p className="text-red-500 text-lg font-sf-light">{error}</p>
            </div>
          )}
          <div className="mb-4 flex items-center">
            <label htmlFor="username" className="w-1/3 text-gray-600 font-sf-regular mb-2">Username</label>
            <input
              type="text"
              id="username"
              className="w-2/3 p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="password" className="w-1/3 text-gray-600 font-sf-regular mb-2">Password</label>
            <input
              type="password"
              id="password"
              className="w-2/3 p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <p className="text-gray-500 text-xs mt-1 mb-4 w-2/3 ml-auto font-sf-light">
              The password must have at least 8 characters, at least 1 digit(s), at least 1 lower case letter(s), at least 1 upper case letter(s), at least 1 non-alphanumeric character(s) such as *, -, or #.
          </p>
          <div className="mb-6 flex items-center">
            <label htmlFor="confirm-password" className="w-1/3 text-gray-600 font-sf-regular mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              className="w-2/3 p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="mb-6 flex items-center">
            <h3 className="text-2xl font-sf-bold text-blue-800 mr-4">Personal Information</h3>
            <hr className="border-blue-800 border-t-2 w-full flex-1"/>
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="email" className="w-1/3 text-gray-600 font-sf-regular mb-2">Email Address</label>
            <input
              type="text"
              id="email"
              className="w-2/3 p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="first-name" className="w-1/3 text-gray-600 font-sf-regular mb-2">First Name</label>
            <input
              type="text"
              id="first-name"
              className="w-2/3 p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex items-center">
            <label htmlFor="last-name" className="w-1/3 text-gray-600 font-sf-regular mb-2">Last Name</label>
            <input
              type="text"
              id="last-name"
              className="w-2/3 p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-6 flex items-center">
            <h3 className="text-2xl font-sf-bold text-blue-800 mr-4">Data Privacy</h3>
            <hr className="border-blue-800 border-t-2 w-full flex-1"/>
          </div>
          <div className="mb-6 flex items-start px-10 py-1">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 mt-1"
            />
            <label htmlFor="terms" className="text-gray-500 text-sm font-sf-light">I hereby allow TESDA to use/post my contact details, name, email, cell phone/landline nos. and other information I provided which may be used for employment opportunities and other purposes.</label>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-700 text-white font-sf-light py-2 px-8 rounded-full focus:outline-none focus:shadow-outline"
              onClick={handleSignup}
            >
              Create Account
            </button>
          </div>
          <div className="text-center mt-5">
            <a href="/login" className="text-blue-800 hover:text-blue-600 font-sf-regular">Already have an account? Sign in ↗</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
