import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';

import Modal from "../components/Modal";

import { FaEye, FaEyeSlash } from 'react-icons/fa';


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    if (location.search.includes('redirected=true')) { // if the user clicks get started when not logged in 
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }
      const res = await axiosInstance.post("/auth/signin", {username, password});
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch(err) {
      dispatch(loginFailure());
      setError(err.response ? err.response.data.message : err.message);
    }
  }

  const handleForgotPasswordRedirect = () => {
    navigate('/forgot-password?from=login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 pt-20 px-4 relative overflow-hidden">
      {/* Graphics */}
      <img
        src="/assets/cones.png"
        alt="Decorative graphic"
        className="absolute top-[10px] right-[-150px] w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] opacity-90 pointer-events-none"
      />
      <img
        src="/assets/boxes.png"
        alt="Decorative graphic"
        className="absolute lg:bottom-[-300px] bottom-[100px] left-[-85px] w-[300px] sm:w-[400px] md:w-[500px] lg:w-[630px] opacity-90 pointer-events-none"
      />
  
      {/* eNSAYO Logo */}
      <div className="absolute top-4 left-4 sm:left-10 sm:top-8 md:left-12 lg:left-16 text-blue-800 text-2xl font-sf-bold">
        <Link to="/">
          <img className="h-8 sm:h-10 md:h-12" alt="eNSAYO Logo" src="/assets/ensayo-logo.png" />
        </Link>
      </div>
  
      {/* Login Form */}
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white px-8 sm:px-12 md:px-16 py-10 sm:py-12 md:py-14 rounded-2xl shadow-custom-dark mt-10 relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-satoshi-bold text-[#0C3E89] flex items-center justify-center">
            Welcome to
            <img className="inline-block h-6 sm:h-7 md:h-8 ml-2" alt="eNSAYO Logo" src="/assets/ensayo-logo.png" />
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg font-sf-regular mt-2">
            Don't have an account yet? <Link to="/register" className="text-blue-800 hover:text-blue-600 font-sf-regular">Register here ↗</Link>
          </p>
        </div>
        {error && <p className="text-red-500 text-center mb-4 font-sf-regular">{error}</p>}
        <form>
          <div className="flex flex-col items-center space-y-4">
            <div className="flex justify-center w-full">
              <input
                type="text"
                id="username"
                className="w-full p-2 pl-4 border border-gray-400 rounded-md font-sf-regular"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="relative flex justify-center w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full p-2 pl-4 pr-10 border border-gray-400 rounded-md font-sf-regular"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-600" />
                ) : (
                  <FaEye className="text-gray-600" />
                )}
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <Link to="/forgot-password?from=login" className="text-blue-800 hover:text-blue-600 font-sf-regular">Forgot password?</Link>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-[#2056A8] hover:bg-blue-700 text-white font-sf-light py-2 sm:py-3 px-8 sm:px-10 md:px-12 rounded-full focus:outline-none focus:shadow-outline mt-8 sm:mt-10"
              onClick={handleLogin}
            >
              Log in
            </button>
          </div>
        </form>
      </div>
      {showModal && (
        <div>
          <Modal message="User account is required" />
        </div>
      )}
    </div>
  );
};

export default Login;
