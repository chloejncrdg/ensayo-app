import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddContent from '../components/AddContent';
import EditContent from '../components/EditContent';
import Table from '../components/Table';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('courseSections');
  const [courseSections, setCourseSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  const fetchData = async (url, setData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url);
      const { courseSections, courses, modules, units } = response.data;
      const data = courseSections || courses || modules || units;
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1)
    switch (activeTab) {
      case 'courseSections':
        fetchData('/contentManagement/getAllCourseSections', setCourseSections);
        break;
      case 'courses':
        fetchData('/contentManagement/getAllCourses', setCourses);
        break;
      case 'modules':
        fetchData('/contentManagement/getAllModules', setModules);
        break;
      case 'units':
        fetchData('/contentManagement/getAllUnits', setUnits);
        break;
      default:
        break;
    }
  }, [activeTab]);


  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  return (
    <div className="p-7">
      <h1 className="text-2xl font-sf-bold mb-4">Content Management</h1>
      <div className="font-sf-regular flex mb-8 gap-1">
        <button onClick={() => setActiveTab('courseSections')} className={`py-2 px-4 ${activeTab === 'courseSections' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Course Sections</button>
        <button onClick={() => setActiveTab('courses')} className={`py-2 px-4 ${activeTab === 'courses' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Courses</button>
        <button onClick={() => setActiveTab('modules')} className={`py-2 px-4 ${activeTab === 'modules' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Modules</button>
        <button onClick={() => setActiveTab('units')} className={`py-2 px-4 ${activeTab === 'units' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Units</button>
      </div>


      <button onClick={() => setShowModal(true)} className="py-2 px-4 bg-green-500 text-white font-sf-regular rounded">
        Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1).replace(/([A-Z])/g, ' $1').trim()}
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Table
            data={activeTab === 'courseSections' ? courseSections : activeTab === 'courses' ? courses : activeTab === 'modules' ? modules : units}
            activeTab={activeTab}
            onEdit={handleEdit}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={5} // Set the number of items per page
          />
        </div>
      )}

      <AddContent
        activeTab={activeTab}
        showModal={showModal}
        setShowModal={setShowModal}
        fetchContent={() => {
          switch (activeTab) {
            case 'courseSections':
              fetchData('/contentManagement/getAllCourseSections', setCourseSections);
              break;
            case 'courses':
              fetchData('/contentManagement/getAllCourses', setCourses);
              break;
            case 'modules':
              fetchData('/contentManagement/getAllModules', setModules);
              break;
            case 'units':
              fetchData('/contentManagement/getAllUnits', setUnits);
              break;
            default:
              break;
          }
        }}
      />

      <EditContent
        activeTab={activeTab}
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        fetchContent={() => {
          switch (activeTab) {
            case 'courseSections':
              fetchData('/contentManagement/getAllCourseSections', setCourseSections);
              break;
            case 'courses':
              fetchData('/contentManagement/getAllCourses', setCourses);
              break;
            case 'modules':
              fetchData('/contentManagement/getAllModules', setModules);
              break;
            case 'units':
              fetchData('/contentManagement/getAllUnits', setUnits);
              break;
            default:
              break;
          }
        }}
        selectedItem={selectedItem}
      />
    </div>
  );
};

export default ContentManagement;
