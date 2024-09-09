import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// redux
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // redux
  const {currentUser} = useSelector(state => state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (e) => {
    e.preventDefault()
    dispatch(logout());
    navigate('/');
  }

  return (
    <div>
      <nav className="p-5 bg-[#0C3E89] shadow-lg md:flex md:items-center md:justify-between">
        <div className="flex justify-between items-center">
        <img className="pl-5 h-6" alt="eNSAYO Logo" src="/assets/ensayo-nav.png"/>
          <button 
            onClick={toggleMenu} 
            className="text-white text-3xl md:hidden focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        <ul className={`md:flex md:items-center z-[1] md:z-auto md:static absolute bg-[#0C3E89] w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 transition-all ease-in duration-500 ${isOpen ? 'top-30 opacity-100' : 'top-[-400px] opacity-0 md:opacity-100'}`}>
          <li className="mx-4 my-6 md:my-0">
            <a href="/" className="text-lg font-sf-regular text-white hover:text-blue-400 duration-500">Home</a>
          </li>
          <li className="mx-4 my-6 md:my-0">
            <a href="/dashboard" className="text-lg font-sf-regular text-white hover:text-blue-400 duration-500">Courses</a>
          </li>
          {currentUser ? (
            <>
              <li className="mx-4 my-6 md:my-0">
                <a href="/profile" className="text-lg font-sf-regular text-white hover:text-blue-400 duration-500">Hello, {currentUser.firstName}</a>
              </li>
              <li>
                <Link to="/">
                  <button onClick={handleLogout} className="text-lg font-sf-regular text-white hover:text-blue-400 duration-500">Logout</button>
                </Link>
              </li>
            </>
          ) :  
          <li className="mx-4 my-6 md:my-0">
            <Link to="/login">
              <button className="bg-white text-blue-800 font-sf-bold duration-500 px-6 py-2 mx-4 hover:bg-opacity-60 rounded">
                Get started
              </button>
            </Link>
          </li>
          }
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;

