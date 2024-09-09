import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { updateUserProfile } from '../redux/userSlice';
import axios from 'axios';

import EditProfile from '../components/EditProfile';
import Progress from '../components/Progress';

import { FaClock, FaRegCheckCircle, FaListAlt } from 'react-icons/fa';


const Profile = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progresses, setProgresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('assigned'); // Default to 'assigned' tab

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      fetchProgresses();
    }
  }, [currentUser]);

  const fetchProgresses = async () => {
    try {
      const response = await axiosInstance.get(`/progress/${currentUser._id}`);
      setProgresses(response.data);
    } catch (error) {
      console.error('Error fetching progresses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveProfile = (updatedData) => {
    dispatch(updateUserProfile(updatedData)); // Update the user profile in the redux store
    setIsModalOpen(false);
  };

  const filterAssignedProgresses = () => {
    return progresses.filter(progress => progress.progress < 100);
  };

  const filterCompletedProgresses = () => {
    return progresses.filter(progress => progress.progress === 100);
  };

  return (
    <div className="mx-auto max-w-screen-lg min-h-screen px-4 py-8 mb-48">
      
      {/* Profile Section */}
      <div className="mt-8 p-6">
        <div className="flex items-center justify-between">
          {/* Profile Picture and User Info */}
          <div className="flex items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-300">
              {currentUser.profilePicture ? (
                <img
                  src={currentUser.profilePicture}
                  alt={`${currentUser.firstName}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-500 font-sf-regular"></span>
                </div>
              )}
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-sf-bold text-gray-800">{currentUser.firstName} {currentUser.lastName}</h2>
              <p className="font-sf-regular text-xl text-gray-500 pl-1">{currentUser.username}</p>
              <p className="text-base font-sf-regular text-gray-500 mt-4 flex items-center">
                <FaClock className="mr-2 text-gray-500 text-base" /> {/* Larger icon */}
                Joined {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
          {/* Edit Profile Button */}
          <button
            className="ml-4 bg-[#1251AF] hover:bg-blue-700 text-white font-sf-bold py-2 px-6 rounded-md"
            onClick={handleEditProfile}
          >
            Edit Account
          </button>
        </div>
        
        {/* Divider */}
        <hr className="my-8 border-gray-400" />
  
  
        {/* Tab Navigation */}
        <div className="flex justify-start mt-8 gap-8">
          <div className='flex items-center'>
            <FaListAlt className={`text-3xl ${activeTab === 'assigned' ? 'text-blue-800' : 'text-gray-400'}`} />
            <button
              className="pl-3 font-sf-bold text-3xl"
              onClick={() => setActiveTab('assigned')}
            >
              <span className={`py-1 ${activeTab === 'assigned' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-400'}`}>
                Assigned Items
              </span>
            </button>
          </div>
          <div className='flex items-center'>
            <FaRegCheckCircle className={`text-3xl ${activeTab === 'completed' ? 'text-blue-800' : 'text-gray-400'}`} />
            <button
              className="pl-3 font-sf-bold text-3xl"
              onClick={() => setActiveTab('completed')}
            >
              <span className={`py-1 ${activeTab === 'completed' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-400'}`}>
                Completed
              </span>
            </button>
          </div>
        </div>
        <div className='mt-10 font-sf-regular'>
        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : activeTab === 'assigned' ? (
          filterAssignedProgresses().length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-48 mb-48">
              <img
                src="/assets/shapes.png"
                alt="No assigned items"
                className="w-[380px] h-[250px] md:w-[450px] md:h-[300px] mb-4" // Adjust the size as needed
              />
              <p className="text-gray-500 text-4xl mb-4">Start browsing courses</p>
              <Link to="/dashboard">
                <button className="bg-blue-800 hover:bg-blue-700 text-white font-sf-bold py-2 px-4 rounded-md text-xl">
                  Browse Courses
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterAssignedProgresses().map(progress => (
                <Link key={progress._id} to={`/lessons/${progress.moduleId.courseId._id}/${progress.moduleId._id}/${progress.unitId._id}`}>
                  <div className="flex flex-col border rounded-lg overflow-hidden shadow-lg">
                    <div className="h-48">
                      {progress.unitId.image ? (
                        <img
                          src={progress.unitId.image}
                          alt={progress.unitId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 font-sf-regular">No image yet</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white flex-grow">
                      <p className="mb-5 text-sm text-gray-500">{progress.moduleId.courseId.title}</p>
                      <Progress value={Math.round(progress.progress)} />
                      <p className="mt-1 mb-2 text-xs text-blue-800">{Math.round(progress.progress)}% Completed</p>
                      <h3 className="mt-2 text-lg text-blue-800 font-semibold">{progress.unitId.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 font-semibold mt-5">{progress.moduleId.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          filterCompletedProgresses().length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-48 mb-48">
              <img
                src="/assets/shapes.png"
                alt="No completed units"
                className="w-[380px] h-[250px] md:w-[450px] md:h-[300px] mb-4" // Adjust the size as needed
              />
              <p className="text-gray-500 text-4xl mb-4">No completed units yet</p>
              <Link to="/courses">
                <button className="bg-blue-800 hover:bg-blue-700 text-white font-sf-bold py-2 px-4 rounded-md text-xl">
                  Browse Courses
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterCompletedProgresses().map(progress => (
                <Link key={progress._id} to={`/lessons/${progress.moduleId.courseId._id}/${progress.moduleId._id}/${progress.unitId._id}`}>
                  <div className="flex flex-col border rounded-lg overflow-hidden shadow-lg">
                    <div className="h-48">
                      {progress.unitId.image ? (
                        <img
                          src={progress.unitId.image}
                          alt={progress.unitId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 font-sf-regular">No image yet</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 bg-white flex-grow">
                      <p className="mb-5 text-sm text-gray-500">{progress.moduleId.courseId.title}</p>
                      <Progress value={Math.round(progress.progress)} />
                      <p className="mt-1 mb-2 text-xs text-blue-800">{Math.round(progress.progress)}% Completed</p>
                      <h3 className="mt-2 text-lg text-blue-800 font-semibold">{progress.unitId.title}</h3>
                      <p className="text-sm text-gray-500 mb-2 font-semibold mt-5">{progress.moduleId.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
      </div>
      </div>
      <EditProfile
        currentUser={currentUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
