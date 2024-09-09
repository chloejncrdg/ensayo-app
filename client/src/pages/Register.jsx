import React from 'react';
import { useState } from "react";
import axios from 'axios';

import { useNavigate, Link } from 'react-router-dom';

import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "../redux/userSlice";

import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [address, setAddress] = useState("")
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });


  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = async (e) => {

    e.preventDefault();
    try {
      if (!username || !password || !email || !firstName || !lastName || !address) {
        setError("All fields are required");
        return;
      }

      if (username.length > 15) {
        setError('Username must be 15 characters or less');
        return;
      }

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        setError('Username must only contain letters, numbers, and underscores');
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

    const addressRegex = /^[a-zA-Z0-9.,\s-]+$/; // Allow only letters, numbers, period, comma, dash, and space
    if (!addressRegex.test(address)) {
      setError('Invalid address');
      return;
    }

    const checkbox = document.getElementById('terms');
    if (!checkbox.checked) {
      setError("Please check the Data Privacy notice");
      return;
    }

      const res = await axiosInstance.post("/auth/signup", { username, password, email, firstName, lastName, address });
    
      dispatch(loginStart()); // Dispatch login start action
      const loginRes = await axiosInstance.post("/auth/signin", { username, password });
      dispatch(loginSuccess(loginRes.data)); // Dispatch login success action

      setUsername("");
      setPassword("");
      setEmail("");
      setFirstName("");
      setLastName("");
      setAddress("");

      console.log("User successfully created");

      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        if (err.response.data.message === "Username already exists") {
          setError("Username already exists");
        } else if (err.response.data.message === "User with this email already exists") {
          setError("User with this email already exists");
        } else {
          setError(err.response.data.message);
        }
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-20 px-4 relative overflow-hidden">
      {/* Graphics */}
      <img
        src="/assets/cones.png"
        alt="Decorative graphic"
        className="absolute top-[10px] right-[-150px] w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] opacity-90 pointer-events-none z-0"
      />
      <img
        src="/assets/boxes.png"
        alt="Decorative graphic"
        className="absolute bottom-[-200px] sm:bottom-[-230px] md:bottom-[-260px] lg:bottom-[-300px] left-[-45px] w-[300px] sm:w-[400px] md:w-[500px] lg:w-[630px] opacity-90 pointer-events-none z-0"
      />
  
      <div className="absolute top-4 left-4 sm:left-10 sm:top-8 md:left-12 lg:left-16">
        <Link to="/"><img className="h-8 sm:h-10 md:h-12" alt="eNSAYO Logo" src="/assets/ensayo-logo.png" /></Link>
      </div>
  
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl bg-white px-6 sm:px-10 md:px-12 lg:px-16 py-8 sm:py-10 md:py-12 lg:py-14 rounded-2xl shadow-custom-dark relative z-10 mb-20 sm:mb-28 md:mb-36 lg:mb-48 mt-10 sm:mt-12 md:mt-14 lg:mt-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-sf-bold text-[#2056A8] mb-4 sm:mb-5 md:mb-6 text-center">Create an account</h2>
        <form>
          <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-sf-bold text-[#2056A8] mb-2 sm:mb-0 sm:mr-4">Login Information</h3>
            <hr className="border-blue-800 border-t-2 w-full flex-1"/>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <label htmlFor="username" className="w-full sm:w-1/3 text-gray-600 font-sf-regular mb-2 sm:mb-0">Username</label>
            <input
              type="text"
              id="username"
              className="w-full sm:w-2/3 p-2 sm:p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center relative">
            <label htmlFor="password" className="w-full sm:w-1/3 text-gray-600 font-sf-regular mb-2 sm:mb-0">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full sm:w-2/3 p-2 sm:p-1 border border-gray-400 rounded-md font-sf-regular pr-10"
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-1 mb-4 w-full sm:w-2/3 sm:ml-auto font-sf-light">
            The password must have at least 8 characters, at least 1 digit(s), at least 1 lower case letter(s), at least 1 upper case letter(s), at least 1 non-alphanumeric character(s) such as *, -, or #.
          </p>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center relative">
            <label htmlFor="confirm-password" className="w-full sm:w-1/3 text-gray-600 font-sf-regular mb-2 sm:mb-0">Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              className="w-full sm:w-2/3 p-2 sm:p-1 border border-gray-400 rounded-md font-sf-regular pr-10"
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-sf-bold text-[#2056A8] mb-2 sm:mb-0 sm:mr-4">Personal Information</h3>
            <hr className="border-blue-800 border-t-2 w-full flex-1"/>
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <label htmlFor="email" className="w-full sm:w-1/3 text-gray-600 font-sf-regular mb-2 sm:mb-0">Email Address</label>
            <input
              type="text"
              id="email"
              className="w-full sm:w-2/3 p-2 sm:p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <label htmlFor="first-name" className="w-full sm:w-1/3 text-gray-600 font-sf-regular mb-2 sm:mb-0">First Name</label>
            <input
              type="text"
              id="first-name"
              className="w-full sm:w-2/3 p-2 sm:p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <label htmlFor="last-name" className="w-full sm:w-1/3 text-gray-600 font-sf-regular mb-2 sm:mb-0">Last Name</label>
            <input
              type="text"
              id="last-name"
              className="w-full sm:w-2/3 p-2 sm:p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center">
            <label htmlFor="address" className="w-full sm:w-1/3 text-gray-600 font-sf-regular mb-2 sm:mb-0">Address</label>
            <input
              type="text"
              id="address"
              className="w-full sm:w-2/3 p-2 sm:p-1 border border-gray-400 rounded-md font-sf-regular"
              onChange={e => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4 sm:mb-5 md:mb-6 flex flex-col sm:flex-row items-start sm:items-center">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-sf-bold text-[#2056A8] mb-2 sm:mb-0 sm:mr-4">Data Privacy</h3>
            <hr className="border-blue-800 border-t-2 w-full flex-1"/>
          </div>
          <div className="mb-6 flex items-start px-2 sm:px-4 md:px-10 py-1">
            <input
              type="checkbox"
              id="terms"
              className="mr-2 mt-1"
            />
            <label htmlFor="terms" className="text-gray-500 text-xs sm:text-sm md:text-base font-sf-regular">I hereby allow TESDA to use/post my contact details, name, email, cell phone/landline nos. and other information I provided which may be used for employment opportunities and other purposes.</label>
          </div>
          {error && (
            <div className="mb-4 flex justify-center">
              <p className="text-red-500 font-sf-regular">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-[#2056A8] hover:bg-blue-700 text-white font-sf-regular py-2 sm:py-2.5 md:py-3 px-8 sm:px-10 md:px-12 rounded-full focus:outline-none focus:shadow-outline"
              onClick={handleSignup}
            >
              Create Account
            </button>
          </div>
          <div className="text-center mt-4 sm:mt-5">
            <a href="/login" className="text-blue-800 hover:text-blue-600 font-sf-regular text-sm sm:text-base">Already have an account? Sign in ↗</a>
          </div>
        </form>
      </div>
    </div>
  );
  
};

export default Register;
