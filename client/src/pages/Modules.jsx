import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { useSelector, useDispatch } from 'react-redux';
import { updateEnrolledCourses } from "../redux/userSlice";
import Skeleton from '../components/Skeleton';

const Modules = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState(null);
  const [courseTitle, setCourseTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolledModules, setEnrolledModules] = useState([]);

  const currentUser = useSelector(state => state.user.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await axiosInstance.get(`/content/modules/${courseId}`);
        setModules(response.data.modules);
        setCourseTitle(response.data.course.title);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  useEffect(() => {
    // Set enrolled modules when currentUser changes
    if (currentUser) {
      setEnrolledModules(currentUser.enrolledCourses || []);
    }
  }, [currentUser]);

  const handleStartCompetency = async (moduleId) => {
    try {
      if (currentUser) {
        // Check if moduleId is already in enrolledCourses
        const isEnrolled = enrolledModules.includes(moduleId);
        
        if (!isEnrolled) {
          // If not enrolled, update enrolledCourses and then navigate
          await axiosInstance.put(`/users/${currentUser._id}/courses`, { moduleId: moduleId });
          dispatch(updateEnrolledCourses(moduleId));
          setEnrolledModules([...enrolledModules, moduleId]); // Update local state
        }
        
        navigate(`/units/${courseId}/${moduleId}`);
      } else {
        // If no logged-in user, redirect to the login page
        navigate('/login?redirected=true');
      }
    } catch (error) {
      console.error('Error updating user courses:', error);
      // Handle error as needed
    }
  };

  const isEnrolled = (moduleId) => {
    return currentUser && currentUser.enrolledCourses.includes(moduleId);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen">
        <Link to={`/dashboard`}>
          <p className='font-sf-bold text-xl text-gray-500 underline'>Course</p>
        </Link>
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
    return <div>Error fetching modules: {error.message}</div>;
  }

  if (!modules) {
    return <div>No modules found</div>;
  }

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen">
      <Link to={`/dashboard`}>
        <p className='font-sf-bold text-xl text-gray-500 underline'>Course</p>
      </Link>
      <h1 className="text-5xl font-sf-bold text-gray-900">{courseTitle}</h1>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modules && modules.length > 0 ? (
          modules.map((module) => (
            <div key={module._id} className="relative">
              {isEnrolled(module._id) ? (
                <Link to={`/units/${courseId}/${module._id}`} className="block w-full h-full">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="h-48 relative">
                      {module.image ? (
                        <img
                          src={module.image}
                          alt={module.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 font-sf-regular">No image yet</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow p-4 flex flex-col items-center justify-center">
                      <h3 className="text-lg font-sf-bold text-blue-800">{module.title}</h3>
                      {!isEnrolled(module._id) && (
                        <button
                          className="w-full mt-4 bg-blue-800 hover:bg-blue-700 text-white font-sf-bold py-2 px-4 rounded-md"
                          onClick={() => handleStartCompetency(module._id)}
                        >
                          START COMPETENCY
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                  <div className="h-48 relative">
                    {module.image ? (
                      <img
                        src={module.image}
                        alt={module.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500 font-sf-regular">No image yet</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-grow p-4 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-sf-bold text-blue-800">{module.title}</h3>
                    {!isEnrolled(module._id) && (
                      <button
                        className="w-full mt-4 bg-blue-800 hover:bg-blue-700 text-white font-sf-bold py-2 px-4 rounded-md"
                        onClick={() => handleStartCompetency(module._id)}
                      >
                        GET STARTED
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="mt-4 text-gray-400">No modules available for this course</p>
        )}
      </div>
    </div>
  );  
};

export default Modules;
