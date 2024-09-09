import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';

const Practicals = () => {
  const { courseId, moduleId, unitId, practicalGroupId } = useParams();
  const {unit, setUnit}  = useState(null);
  const location = useLocation();
  
  // Access simulationPath and title from location.state
  const { simulationPath, title } = location.state || {};

  // State to handle iframe load error
  const [loadError, setLoadError] = useState(false);

  

  return (
    <div className='mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen font-sf-regular mt-12 mb-48'>
      <div className="flex flex-wrap text-lg font-sf-bold text-gray-500">
        <Link to={`/lessons/${courseId}/${moduleId}/${unitId}`}>
          <p className='mr-2 mb-2 underline'>Return to lessons</p>
        </Link>
      </div>
      <h1 className="text-4xl font-sf-bold text-gray-800 mb-2">{title}</h1>
      {simulationPath ? (
        loadError ? (
          <p className="mt-4 text-gray-400">No simulation available for this practical group.</p>
        ) : (
          <iframe
            src={simulationPath}
            title="Simulation"
            width="100%"
            height="700"
            frameBorder="0"
            onError={() => setLoadError(true)} // Set error state if the iframe fails to load
          ></iframe>
        )
      ) : (
        <p className="mt-4 text-gray-400">No simulation available for this practical group.</p>
      )}
    </div>
  );
}

export default Practicals;
