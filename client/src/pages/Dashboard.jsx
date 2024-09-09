import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [courseSections, setCourseSections] = useState([]);
  const [courseSectionState, setCourseSectionState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const fetchCourseSections = async () => {
      try {
        const response = await axiosInstance.get('/content/course-sections');
        setCourseSections(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchCourseSections();
  }, []);

  const toggleCourses = async (courseSectionId) => {
    try {
      if (courseSectionState[courseSectionId]) {
        // If courses are already visible, hide them
        setCourseSectionState((prevState) => ({
          ...prevState,
          [courseSectionId]: null,
        }));
      } else {
        // If courses are not visible, fetch and show them
        const response = await axiosInstance.get(`/content/courses/${courseSectionId}`);
        if (!response.data || !Array.isArray(response.data)) {
          throw new Error('Courses data not in the expected format');
        }
        setCourseSectionState((prevState) => ({
          ...prevState,
          [courseSectionId]: response.data,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen">
        <p className='font-sf-bold text-xl text-gray-500'>Dashboard</p>
        <h1 className="text-5xl font-sf-bold text-gray-900">Course Sections</h1>
        <div className='mt-6'>
          {[...Array(6)].map((_, index) => (
            <p key={index} className='mt-2 w-full h-16 bg-gray-300 rounded-full animate-pulse'></p>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error fetching course sections: {error.message}</p>;
  }

  return (
    <div className="mx-auto max-w-screen-lg px-4 py-8 relative min-h-screen">
      <p className='font-sf-bold text-xl text-gray-500'>Dashboard</p>
      <h1 className="text-5xl font-sf-bold text-gray-900">Course Sections</h1>
      {courseSections.map((courseSection) => (
        <div key={courseSection._id} className="my-4">
          <div className="rounded-full border border-gray-300 p-2 px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-lg">
                <p className='font-sf-bold text-xl text-blue-800'>{courseSection.title}</p>
              </h1>
              <button
                onClick={() => toggleCourses(courseSection._id)}
                className="px-2 py-2 text-white rounded-md font-sf-regular text-sm flex items-center"
              >
                <div className="bg-gray-700 rounded-full p-2 flex justify-center items-center">
                  {courseSectionState[courseSection._id] ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 15a1 1 0 01-.707-.293l-5-5a1 1 0 011.414-1.414L10 12.586l4.293-4.293a1 1 0 111.414 1.414l-5 5A1 1 0 0110 15z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 01.293-.707l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5A1 1 0 013 10z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
          {courseSectionState[courseSection._id] && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {courseSectionState[courseSection._id].map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {course.image ? (
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    ) : (
                      <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500 font-sf-regular">No image yet</span>
                      </div>
                    )
                  }
                  <div className="p-4">
                    <Link to={`/modules/${course._id}`} className="font-sf-bold text-lg text-blue-800 block mb-2">
                      {course.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {courseSectionState[courseSection._id] && courseSectionState[courseSection._id].length === 0 && (
            <p className="mt-4 font-sf-regular text-gray-400">No courses available for this section</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
