// with search functionality
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  fetchAllUsers,
  fetchTotalUsers,
  fetchUsersEnrolledInCourses,
  fetchUsersWithEnrolledCourses
} from '../api.js';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersWithCourses, setUsersWithCourses] = useState(0);
  const [enrollmentData, setEnrollmentData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [queryRange, setQueryRange] = useState('');

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allUsers, totalUsersCount, usersWithCoursesCount, usersEnrollment] = await Promise.all([
          fetchAllUsers(currentPage, 20, searchTerm), // Including searchTerm in the API call
          fetchTotalUsers(),
          fetchUsersWithEnrolledCourses(),
          fetchUsersEnrolledInCourses()
        ]);

        setUsers(allUsers.users);
        setTotalUsers(totalUsersCount);
        setUsersWithCourses(usersWithCoursesCount);
        setEnrollmentData(usersEnrollment);

        // Update total pages based on total users and per page count
        setTotalPages(Math.ceil(totalUsersCount / 20)); // Assuming 20 users per page

        const startRange = (currentPage - 1) * 20 + 1;
        const endRange = Math.min(currentPage * 20, totalUsersCount);
        setQueryRange(`${startRange}-${endRange} out of ${totalUsersCount}`);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadData();
  }, [currentPage, searchTerm]); // Adding searchTerm to the dependency array

  const openModal = async (userId) => {
    try {
      const response = await axiosInstance.get(`/userManagement/getUserDetails/${userId}`);
      setSelectedUser(response.data); // Assuming response.data contains user details
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } 
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-8 bg-gray-100">
      <h1 className="text-2xl font-sf-bold mb-4 text-blue-800">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 bg-white rounded-lg shadow p-6">
        <div className="bg-custom-blue rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-lg font-sf-regular mb-1 text-white">TOTAL USERS</h2>
          <p className="text-4xl font-sf-bold text-white ml-4">{totalUsers}</p>
        </div>
        <div className="bg-custom-darkBlue rounded-lg shadow p-6 flex flex-col">
          <h2 className="text-xl font-sf-regular mb-2 text-white">ENROLLED USERS</h2>
          <p className="text-4xl font-sf-bold text-white ml-4">{usersWithCourses}</p>
        </div>
      </div>
      <div className="flex justify-between mb-4">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search by name, username, or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="py-2 px-4 rounded font-sf-regular text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 w-96"
        />
        {/* Pagination controls */}
        <div>
          <button
            className={`bg-custom-blue text-white font-sf-bold py-2 px-4 rounded mr-2 ${currentPage === 1 || searchTerm ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className={`bg-custom-blue text-white font-sf-bold py-2 px-4 rounded ml-2 ${currentPage === totalPages || searchTerm ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            onClick={handleNextPage} 
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className='bg-custom-blue'>
            <tr className='font-sf-bold text-sm text-white'>
              <th className="px-4 py-2 border-b text-left">NAME</th>
              <th className="px-4 py-2 border-b text-left">USERNAME</th>
              <th className="px-4 py-2 border-b text-left">EMAIL</th>
              <th className="px-4 py-2 border-b text-left">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="text-left border-b font-sf-regular text-gray-700">
                <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  <button
                    className="bg-custom-blue hover:bg-blue-700 text-white font-sf-regular py-2 px-4 my-2 ml-5 text-sm rounded"
                    onClick={() => openModal(user._id)}
                  >
                    VIEW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="font-sf-bold flex justify-center mt-2 text-sm text-gray-600">
          {queryRange}
        </div>
        {/* Display total pages */}
        <div className="font-sf-regular flex justify-center text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-x-hidden overflow-y-auto bg-black bg-opacity-50">
        <div className="relative mx-auto max-w-3xl p-6">
          <div className="bg-white rounded-lg shadow-lg relative flex flex-col p-6 max-h-[80vh] overflow-y-auto">
            {/* Modal content */}
            <h3 className="text-lg font-sf-bold mb-2 text-blue-800">User Information</h3>
            {/* Display user details and enrolled courses here */}
            {selectedUser && (
              <>
                <div className="grid grid-cols-2 gap-x-8">
                  <div className="mb-4">
                    <p className="font-sf-bold">Name:</p>
                    <p className="font-sf-regular">{selectedUser.firstName} {selectedUser.lastName}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-sf-bold">Username:</p>
                    <p className="font-sf-regular">{selectedUser.username}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-sf-bold">Email:</p>
                    <p className='font-sf-regular'>{selectedUser.email}</p>
                  </div>
                </div>

                {selectedUser.enrolledCourses && selectedUser.enrolledCourses.length > 0 ? (
                  <div className="mt-4">
                    <h4 className="text-lg font-sf-bold text-blue-800 mb-2">Enrolled Courses</h4>
                    {selectedUser.enrolledCourses.map((course, index) => (
                      <div key={index} className="mb-6">
                        <p className="font-sf-bold">{course}</p>
                        {/* Display progress or 'No progress yet' */}
                        {selectedUser.progress && selectedUser.progress.length > 0 ? (
                          selectedUser.progress.some(progress => progress.moduleId.title === course) ? (
                            <table className="min-w-full bg-white rounded-lg shadow mt-2">
                              <thead className="bg-custom-blue text-white">
                                <tr className="font-sf-bold text-sm text-left">
                                  <th className="px-4 py-2 border-b">Unit</th>
                                  <th className="px-4 py-2 border-b">Progress</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedUser.progress
                                  .filter(progress => progress.moduleId.title === course)
                                  .map(progressItem => (
                                    <tr key={progressItem._id} className="text-left border-b">
                                      <td className="text-sm font-sf-regular px-4 py-2">{progressItem.unitId.title}</td>
                                      <td className="text-sm font-sf-regular px-4 py-2">{Math.round(progressItem.progress)}%</td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          ) : (
                            <p className="font-sf-regular mt-2 text-sm text-gray-400">No progress yet.</p>
                          )
                        ) : (
                          <p className="font-sf-regular mt-2 text-sm text-gray-400">No progress yet.</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-sf-regular text-gray-400 mt-4">Not enrolled in any core competencies yet.</p>
                )}
              </>
            )}
            {/* Close modal button */}
            <div className="mt-4 text-right">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center font-sf-regular"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Dashboard;