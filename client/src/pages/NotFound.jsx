import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-8xl font-sf-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8 font-sf-regular">Sorry, the page you are looking for does not exist.</p>
      <button
        onClick={() => navigate('/')}
        className="font-sf-regular px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
