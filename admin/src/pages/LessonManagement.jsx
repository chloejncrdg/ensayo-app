import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../components/Table';
import LessonModal from '../components/LessonModal';
import AddLesson from '../components/AddLesson';
import EditLesson from '../components/EditLesson'

const LessonManagement = () => {

  const [activeTab, setActiveTab] = useState('toolGroups');
  const [toolGroups, setToolGroups] = useState([]);
  const [tools, setTools] = useState([]);
  const [practicalGroups, setPracticalGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalItem, setModalItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null)

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });


  const fetchData = async (url, setData) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(url);
      const { toolGroups, practicalGroups, tools } = response.data;
      const data = toolGroups || practicalGroups || tools;
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
      case 'toolGroups':
        fetchData('/lessonManagement/getAllToolGroups', setToolGroups);
        break;
      case 'tools':
        fetchData('/lessonManagement/getAllTools', setTools);
      break;  
      case 'practicalGroups':
        fetchData('/lessonManagement/getAllPracticalGroups', setPracticalGroups);
        break;
      default:
        break;
    }
  }, [activeTab]);


  const handleView = (item) => {
    setModalItem(item);
  };

  const handleShowAddModal = () => {
    setShowAddModal(true);
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowEditModal(true)
  };

  const handleCloseModal = () => {
    setModalItem(null);
  };



  return (
    <div className='p-7'>
      <h1 className="text-2xl font-sf-bold mb-4">Lesson Management</h1>
      <div className="font-sf-regular flex mb-8 gap-1">
        <button onClick={() => setActiveTab('toolGroups')} className={`py-2 px-4 ${activeTab === 'toolGroups' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Tool Groups</button>
        <button onClick={() => setActiveTab('tools')} className={`py-2 px-4 ${activeTab === 'tools' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Tools</button>
        <button onClick={() => setActiveTab('practicalGroups')} className={`py-2 px-4 ${activeTab === 'practicalGroups' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}>Practicals</button>
      </div>

      <button  onClick={handleShowAddModal} className="py-2 px-4 bg-green-500 text-white font-sf-regular rounded">
        Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1).replace(/([A-Z])/g, ' $1').trim()}
      </button>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <Table
            data={activeTab === 'toolGroups' ? toolGroups : activeTab === 'tools' ? tools : practicalGroups}
            activeTab={activeTab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            onView={handleView}
            onEdit={handleEdit}
            itemsPerPage={5} // Set the number of items per page
          />
        </div>
      )}

      {showAddModal && (
        <AddLesson
            activeTab={activeTab}
            showModal={showAddModal}
            setShowModal={setShowAddModal}
            fetchContent={() => {
              switch (activeTab) {
                case 'toolGroups':
                  fetchData('/lessonManagement/getAllToolGroups', setToolGroups);
                  break;
                case 'tools':
                  fetchData('/lessonManagement/getAllTools', setTools);
                break;  
                case 'practicalGroups':
                  fetchData('/lessonManagement/getAllPracticalGroups', setPracticalGroups);
                  break;
                default:
                  break;
              }
            }}
          />
        )}

      {showEditModal && (
        <EditLesson
            activeTab={activeTab}
            showModal={showEditModal}
            setShowModal={setShowEditModal}
            fetchContent={() => {
              switch (activeTab) {
                case 'toolGroups':
                  fetchData('/lessonManagement/getAllToolGroups', setToolGroups);
                  break;
                case 'tools':
                  fetchData('/lessonManagement/getAllTools', setTools);
                break;  
                case 'practicalGroups':
                  fetchData('/lessonManagement/getAllPracticalGroups', setPracticalGroups);
                  break;
                default:
                  break;
              }
            }}
            selectedItem={editItem}
          />
        )}



      {modalItem && 
        <LessonModal 
          isOpen={!!modalItem} 
          onClose={handleCloseModal} 
          item={modalItem} 
          type={activeTab} 
        />}
    </div>
  )
}

export default LessonManagement;
