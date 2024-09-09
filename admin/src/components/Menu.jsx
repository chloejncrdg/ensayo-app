import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/adminSlice';


const Menu = () => {

  const {currentAdmin} = useSelector(state=> state.admin)
  const location = useLocation();

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout());
    navigate("/admin/login")

  };

  return (
    <div className="h-screen w-64 bg-blue-900 text-white fixed top-0 left-0 shadow-lg">
      <div className="p-6 text-2xl font-semibold">
        <img className='p-2 mt-8' alt='ENSAYO Logo' src='/assets/logo.png' />
      </div>
      <nav className="mt-10">
        {/* User Management */}
         <NavLink 
          to="/" 
          className={`flex items-center font-sf-regular py-2.5 px-4 text-lg rounded transition duration-200 hover:bg-blue-700 hover:text-white ${location.pathname === '/' ? 'bg-blue-700 text-white' : ''}`}
          activeclassname="bg-blue-700 text-white"
        >
          <svg className="w-6 h-6 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" clipRule="evenodd"/>
          </svg>
          <span>Users List</span>
        </NavLink>

        {/* Course Management */}
        <NavLink 
          to="/courses" 
          className={`flex items-center font-sf-regular py-2.5 px-4 text-lg rounded transition duration-200 hover:bg-blue-700 hover:text-white ${location.pathname === '/courses' ? 'bg-blue-700 text-white' : ''}`}
          activeclassname="bg-blue-700 text-white"
        >
          <svg className="w-6 h-6 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M11 4.717c-2.286-.58-4.16-.756-7.045-.71A1.99 1.99 0 0 0 2 6v11c0 1.133.934 2.022 2.044 2.007 2.759-.038 4.5.16 6.956.791V4.717Zm2 15.081c2.456-.631 4.198-.829 6.956-.791A2.013 2.013 0 0 0 22 16.999V6a1.99 1.99 0 0 0-1.955-1.993c-2.885-.046-4.76.13-7.045.71v15.081Z" clipRule="evenodd"/>
          </svg>
          <span>Content Management</span>
        </NavLink>

        {/* Content Management */}
        <NavLink 
          to="/content" 
          className={`flex items-center font-sf-regular py-2.5 px-4 text-lg rounded transition duration-200 hover:bg-blue-700 hover:text-white ${location.pathname === '/content' ? 'bg-blue-700 text-white' : ''}`}
          activeclassname="bg-blue-700 text-white"
        >
          <svg className="w-6 h-6 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
          </svg>
          <span>Lesson Management</span>
        </NavLink>

        {currentAdmin ? (
          <NavLink 
            to="/profile" 
            className={`flex items-center font-sf-regular mt-24 py-2.5 px-4 text-lg rounded transition duration-200 hover:bg-blue-700 hover:text-white ${location.pathname === '/profile' ? 'bg-blue-700 text-white' : ''}`}
            activeclassname="bg-blue-700 text-white"
          >
          <svg className="w-6 h-6 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd"/>
          </svg>
          <span>{currentAdmin.firstName}'s Profile</span>
          </NavLink>

        ) : 
      
        <NavLink 
          to="/profile" 
          className={`flex items-center font-sf-regular mt-24 py-2.5 px-4 text-lg rounded transition duration-200 hover:bg-blue-700 hover:text-white ${location.pathname === '/profile' ? 'bg-blue-700 text-white' : ''}`}
          activeclassname="bg-blue-700 text-white"
        >
          <svg className="w-6 h-6 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z" clipRule="evenodd"/>
          </svg>
          <span>Profile</span>
        </NavLink>}

        <div 
          className="flex items-center font-sf-regular py-2.5 px-4 text-lg rounded transition duration-200 hover:bg-blue-700 hover:text-white"
          onClick={handleLogout}
          style={{ cursor: 'pointer' }}
        >
          <svg className="w-6 h-6 mr-3 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
          </svg>
          <span>Logout</span>
        </div>
        
      </nav>
    </div>
  );
};

export default Menu;
