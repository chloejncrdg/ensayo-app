import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import Skeleton from '../components/Skeleton';

const Units = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const { courseId, moduleId } = useParams();
  const [units, setUnits] = useState(null);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await axiosInstance.get(`/content/units/${moduleId}`);
        setUnits(response.data.units);
        setModule(response.data.module);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUnits();
  }, [moduleId]);

  const handleUnitClick = async (unitId) => {
    try {
      // Make a POST request to create or update progress
      await axiosInstance.post(`/progress/${currentUser._id}/${moduleId}/${unitId}`);
      
      // Handle success: Navigate to lessons or perform other actions
      console.log('Progress created successfully.');
    } catch (error) {
      // Handle error: Display appropriate error message
      console.error('Error creating progress:', error.message || error.response?.data?.message || 'Unknown error occurred');
    }
  };


  
  if (loading) {
    return (
      <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen">
        <div className="flex flex-wrap text-lg font-sf-bold text-gray-500">
          <Link to={`/modules/${courseId}`}>
            <p className='mr-2 underline'>Core Competency</p>
          </Link>
        </div>
        <h1 className="mt-2 w-full h-12 bg-gray-300 rounded"></h1>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      </div>
    
    );
  }


  if (error) {
    return <div>Error fetching units: {error.message}</div>;
  }

  if (!units || units.length === 0) {
    return <div>No units found</div>;
  }


  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen">
      <div className="flex flex-wrap text-lg font-sf-bold text-gray-500">
        <Link to={`/modules/${courseId}`}>
          <p className='mr-2 underline'>Core Competency</p>
        </Link>
      </div>
      <h1 className="text-3xl font-sf-bold text-gray-900">{module.title}</h1>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {units && units.length > 0 ? (
          units.map(unit => (
            <Link
              key={unit.unitId}
              to={`/lessons/${courseId}/${moduleId}/${unit._id}`}
              className="block"
              onClick={() => handleUnitClick(unit._id)}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden h-72">
                <div className="h-48 relative">
                  {unit.image ? (
                    <img
                      src={unit.image}
                      alt={unit.title}
                      className="w-full h-full object-cover"
                    />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 font-sf-regular">No image yet</span>
                      </div>
                    )
                  }
                </div>
                <div className="p-4">
                  <p className='font-sf-bold text-sm text-gray-500 px-3'>UNIT {unit.unitId}</p>
                  <p className="text-base font-sf-bold text-blue-800 px-3">{unit.title}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="mt-4 text-gray-400">No units available for this module</p>
        )}
      </div>
    </div>
  );
};

export default Units;
