import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Resize } from '@react-three/drei';
import { Link, useParams } from 'react-router-dom';
import { XR, createXRStore, XRDomOverlay, useSessionModeSupported } from '@react-three/xr';
import axios from 'axios'; // Import Axios for making HTTP requests

import Tool from '../components/Tool';
import { TbAugmentedReality } from "react-icons/tb";


const Tools = () => {
  const { courseId, moduleId, unitId, toolGroupId } = useParams();
  const [selectedTool, setSelectedTool] = useState(null); // yes
  const [unit, setUnit] = useState(null)
  const [loading, setLoading] = useState(true);
  const [canvasKey, setCanvasKey] = useState(0); // yes
  const [tools, setTools] = useState(null); 
  const [toolGroup, setToolGroup] = useState(null)

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  const supported = useSessionModeSupported('immersive-ar');
  const store = createXRStore();

  // Fetch tool group data from the backend API
  useEffect(() => {
    const fetchTools = async () => {
      try {
        const response = await axiosInstance.get(`/content/tools/${toolGroupId}`);
        if (response.data.tools && response.data.tools.length > 0) {
          setTools(response.data.tools);
          setToolGroup(response.data.toolGroup)
          setLoading(false);
        } else {
          console.error('No tools found in the response');
        }
        setUnit(response.data.unit.title)
      } catch (error) {
        console.error('Error fetching tool group:', error);
        setLoading(false);
      }
    };

    fetchTools();
  }, [toolGroupId]); // Fetch data when toolGroupId changes

  // Update selected tool when toolGroup data changes
  useEffect(() => {
    if (tools && tools.length > 0) {
      setSelectedTool(tools[0]); // Set the first tool as the selected tool
      setCanvasKey(Date.now()); // Initialize the canvas key
    }
  }, [tools]);

  // Handle tool change when selecting from dropdown
  const handleToolChange = (event) => {
    const toolId = event.target.value;
    const tool = tools.find(tool => tool._id.toString() === toolId);
    setSelectedTool(tool);
    setCanvasKey(Date.now()); // Update the canvas key to force re-render
  };

  // Handle tool click
  const handleToolClick = (tool) => {
    setSelectedTool(tool);
    setCanvasKey(Date.now()); // Update the canvas key to force re-render
  };

  
  
  if (loading) {
    return (
      <div className="min-h-screen inset-0 flex items-center justify-center">
        <p className="text-gray-700 text-2xl font-sf-bold">Loading...</p>
      </div>
    );
  }


  if (!tools) {
    return (
    <div className='min-h-screen'>
      <div className='flex justify-center align-center'>
        <div>No tools found</div>
        
      </div>
    </div>
    )
  }

  return (
    <div className="mx-auto max-w-screen-xl px-8 py-8 mt-8 sm:mb-48 mb-16">
      <div className="flex flex-wrap text-lg font-sf-bold text-gray-500">
        <Link to={`/lessons/${courseId}/${moduleId}/${unitId}`}>
          <p className='mr-2 mb-2 underline'>Return to lessons</p>
        </Link>
      </div>
      <h1 className="text-5xl font-sf-bold text-gray-900">{toolGroup.title}</h1>
  
      <div className="flex flex-col sm:flex-row sm:mt-24 mt-16">
        <div className="w-full sm:w-1/3 mb-4 sm:mr-4 sm:h-96 overflow-auto">
          <h2 className="text-base font-sf-bold text-gray-500 mb-2">Select to view:</h2>
          {/* Display buttons for larger screens */}
          <div className="hidden bg-[#F1F1F1] p-4 sm:block">
            {tools.map(tool => (
              <button 
                key={tool._id}
                onClick={() => handleToolClick(tool)}
                className={`text-sm w-full mb-2 p-2 border bg-white rounded-md text-left text-gray-700 font-sf-regular shadow-lg ${selectedTool && selectedTool._id === tool._id ? 'border-blue-500 bg-[#DEF1FF] text-[#125DCD]' : 'border-gray-400'}`}
              >
                {tool.name}
              </button>
            ))}
          </div>
          {/* Display select dropdown for smaller screens */}
          <div className="sm:hidden">
            <select
              onChange={handleToolChange}
              className="w-full p-2 border border-gray-300 rounded-md text-gray-700 font-sf-regular"
              value={selectedTool ? selectedTool._id : ""}
            >
              {tools.map(tool => (
                <option key={tool._id} value={tool._id}>
                  {tool.name}
                </option>
              ))}
            </select>
          </div>
        </div>
  
        <div className="w-full sm:w-[1000px] flex flex-col justify-center items-center">
          <div className="w-full h-[70vh] bg-gray-100 flex justify-center items-center mb-2 sm:mb-0">
            {/* This is where the 3D model would be rendered */}
            {selectedTool ? (
              selectedTool.modelPath ? (
                <Suspense fallback={<div className="flex justify-center items-center h-full font-sf-regular">Loading model...</div>}>
                  <Canvas key={canvasKey}>
                    {/* Your canvas setup */}
                    <ambientLight intensity={0.4} />
                    <directionalLight castShadow position={[1, 10, 1]} intensity={4} />
                    <OrbitControls />
                    <Tool modelPath={selectedTool.modelPath} />
                  </Canvas>
                </Suspense>
              ) : (
                <div className="text-center text-gray-700 font-sf-regular">3D model of {selectedTool.name} not yet available</div>
              )
            ) : (
              <div className="text-center text-gray-700 font-sf-regular">No tool selected</div>
            )}
          </div>
  
          {/* Place the AR button directly below the canvas */}
          <div className="w-full flex justify-center items-center mt-4 mb-12">
            {supported === undefined ? (
              <div className="px-4 py-2 bg-gray-600 text-white rounded-md">Checking AR support...</div>
            ) : supported ? (
              <button
              className="px-4 py-2 bg-[#1F64CC] text-white rounded-md font-sf-regular flex items-center space-x-2"
              onClick={() => store.enterAR()}
              >
                <TbAugmentedReality className="text-2xl" /> {/* AR icon */}
                <span>View in your space</span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-gray-600 text-white rounded-md">AR unsupported</div>
            )}
          </div>
        </div>
  
        <div className='w-full sm:w-1/3 sm:ml-6 mt-8'>
          <h3 className="text-3xl font-sf-bold text-gray-800 mb-2">{selectedTool?.name}</h3>
          <div className="sm:mt-6">
            <p className="text-gray-600 font-sf-regular text-sm">
              {selectedTool && selectedTool.description ? selectedTool.description : "No description yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default Tools;
