import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import Progress from '../components/Progress';
import Skeleton from '../components/Skeleton';


const Lessons = () => {
  const currentUser = useSelector(state => state.user.currentUser);
  const { courseId, moduleId, unitId } = useParams();
  const [toolGroups, setToolGroups] = useState([]);
  const [practicalGroups, setPracticalGroups] = useState([]);
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(0); // State to hold current progress

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchUnitData = async () => {
      try {
        const responseToolGroups = await axiosInstance.get(`/content/tool-groups/${unitId}`);
        const responsePracticalGroups = await axiosInstance.get(`/content/practical-groups/${unitId}`);
        const responseProgress = await axiosInstance.get(`/progress/${currentUser._id}/${moduleId}/${unitId}`); // Fetch current progress

        setUnit(responseToolGroups.data.unit);
        setToolGroups(responseToolGroups.data.toolGroups);
        setPracticalGroups(responsePracticalGroups.data.practicalGroups);
        setCurrentProgress(responseProgress.data.progress); // Set current progress

        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchUnitData();
  }, [unitId, currentUser._id, moduleId]);

  const handleGroupClick = async (groupId, groupType, simulationPath, title) => {
    try {
      // Update progress in backend
      await axiosInstance.put(`/progress/${currentUser._id}/${moduleId}/${unitId}/${groupId}/${groupType}`);
  
      // Fetch updated progress
      const response = await axiosInstance.get(`/progress/${currentUser._id}/${moduleId}/${unitId}`);
      const updatedProgress = response.data.progress;
  
      // Update current progress state
      setCurrentProgress(updatedProgress);
  
      if (groupType === 'ToolGroup') {
        navigate(`/tools/${courseId}/${moduleId}/${unitId}/${groupId}`, { state: { simulationPath, title } });
      } else if (groupType === 'PracticalGroup') {
        navigate(`/practicals/${courseId}/${moduleId}/${unitId}/${groupId}`, { state: { simulationPath, title } });
      }
    } catch (error) {
      console.error('Error updating progress:', error.message);
    }
  };

  
  if (loading) {
    return (
      <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen">
      <div className="flex flex-wrap text-lg font-sf-bold text-gray-500">
        <Link to={`/units/${courseId}/${moduleId}`}>
          <p className='mr-2 underline'>Units</p>
        </Link>
      </div>

      <div className="mt-6">
        <p className='mt-2 w-full h-7 bg-gray-300 rounded'></p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-sf-bold text-blue-800">Tools and Equipments</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-sf-bold text-blue-800">Practicals</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full px-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      </div>

      </div>
    );
  }

  if (error) {
    return <div>Error fetching unit data: {error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen font-sf-regular">
      <div className="flex flex-wrap text-lg font-sf-bold text-gray-500">
        <Link to={`/units/${courseId}/${moduleId}`}>
          <p className='mr-2 underline'>Units</p>
        </Link>
        <p className='mr-2'>&gt;</p>
        <p className='mr-2'>UNIT {unit.unitId}</p>
      </div>
      <h1 className="text-3xl font-sf-bold text-gray-900">{unit.title}</h1>

      <div className="mt-8">
        <Progress value={Math.round(currentProgress)} />
        <p className='font-sf-regular text-blue-800 mt-1'>{Math.round(currentProgress)}% Complete</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-sf-bold text-blue-800">Tools and Equipments</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {toolGroups.length > 0 ? (
            toolGroups.map(toolGroup => (
              <Link
                key={toolGroup._id}
                to="#"
                className="block"
                onClick={() => handleGroupClick(toolGroup._id, 'ToolGroup')}
              >
              <div key={toolGroup._id} className="bg-white rounded-lg shadow-md overflow-hidden h-64">
                <div className="h-2/3">
                  {toolGroup.image ? (
                    <img
                      src={toolGroup.image}
                      alt={toolGroup.title}
                      className="w-full h-full object-cover"
                    />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 font-sf-regular">No image yet</span>
                      </div>
                    )
                  }
                </div>
                <div className="h-1/3 p-4 flex items-center justify-center">
                  <h3 className="text-base font-sf-bold text-blue-800">{toolGroup.title}</h3>
                </div>
              </div>
            </Link>
            ))
          ) : (
            <p className="mt-4 text-gray-400">No tools available for this unit</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-sf-bold text-blue-800">Practicals</h2>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {practicalGroups.length > 0 ? (
            practicalGroups.map(practicalGroup => (
            <div
              key={practicalGroup._id}
              className="block cursor-pointer"
              onClick={() => handleGroupClick(practicalGroup._id, 'PracticalGroup', practicalGroup.simulationPath, practicalGroup.title)}
            >
              <div key={practicalGroup._id} className="bg-white rounded-lg shadow-md overflow-hidden h-72">
                <div className="h-2/3">
                  {practicalGroup.image ? (
                    <img
                      src={practicalGroup.image}
                      alt={practicalGroup.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 font-sf-regular">No image yet</span>
                    </div>
                  )}
                </div>
                <div className="h-1/3 p-4 flex flex-col flex-grow">
                  <h3 className="text-base font-sf-bold text-blue-800">{practicalGroup.title}</h3>
                </div>
              </div>
            </div>
            ))
          ) : (
            <p className="mt-4 text-gray-400">No practicals available for this unit.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lessons;