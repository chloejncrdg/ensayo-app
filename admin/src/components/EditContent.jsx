import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EditContent = ({ activeTab, showModal, setShowModal, fetchContent, selectedItem }) => {
  const [formData, setFormData] = useState({
    title: '',
    courseSectionId: '',
    courseId: '',
    moduleId: '',
    image: '',
    archived: false,
  });
  const [courseSections, setCourseSections] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [formError, setFormError] = useState(false);
  const [imageError, setImageError] = useState(false)

  const imageInput = useRef(null);

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [courseSectionsResponse, coursesResponse, modulesResponse] = await Promise.all([
          axiosInstance.get('/contentManagement/getAllCourseSections'),
          axiosInstance.get('/contentManagement/getAllCourses'),
          axiosInstance.get('/contentManagement/getAllModules'),
        ]);

        setCourseSections(courseSectionsResponse.data.courseSections);
        setCourses(coursesResponse.data.courses);
        setModules(modulesResponse.data.modules);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    }
    fetchOptions();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem.title || '',
        courseSectionId: selectedItem.courseSectionId?._id || '',
        courseId: selectedItem.courseId?._id || '',
        moduleId: selectedItem.moduleId?._id || '',
        image: selectedItem.image || '',
        archived: selectedItem.archived || false,
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (formData.courseSectionId) {
      const filteredCourses = courses.filter(course => course.courseSectionId._id === formData.courseSectionId);
      setFilteredCourses(filteredCourses);
      setFilteredModules([]); // Reset modules when course section changes
    } else {
      setFilteredCourses([]);
    }
  }, [formData.courseSectionId, courses]);

  useEffect(() => {
    if (formData.courseId) {
      const filteredModules = modules.filter(module => module.courseId._id === formData.courseId);
      setFilteredModules(filteredModules);
    } else {
      setFilteredModules([]);
    }
  }, [formData.courseId, modules]);

  const handleEdit = async () => {
    try {
      if (!formData.title) {
        setFormError(true);
        return;
      }
  
      let url = '';
      let data = {
        title: formData.title,
        archived: formData.archived,
      };
  
      let imageUrl = formData.image;
      if (imageInput.current.files.length > 0) {

        const file = imageInput.current.files[0];
        const allowedTypes = ['image/jpeg', 'image/png']; // Allowed image types

        if (!allowedTypes.includes(file.type)) {
          setImageError(true);
          return;
        }
        
        const uploadResponse = await axiosInstance.get('/contentManagement/uploadImage');
        imageUrl = uploadResponse.data.url;
  

        await fetch(imageUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
  
        imageUrl = imageUrl.split('?')[0];  
      }
  
      switch (activeTab) {
        case 'courseSections':
          url = `/contentManagement/editCourseSection/${selectedItem._id}`;
          break;
        case 'courses':
          url = `/contentManagement/editCourse/${selectedItem._id}`;
          data = {
            ...data,
            courseSectionId: formData.courseSectionId,
            image: imageUrl,
          };
          break;
        case 'modules':
          url = `/contentManagement/editModule/${selectedItem._id}`;
          data = {
            ...data,
            courseSectionId: formData.courseSectionId,
            courseId: formData.courseId,
            image: imageUrl,
          };
          break;
        case 'units':
          url = `/contentManagement/editUnit/${selectedItem._id}`;
          data = {
            ...data,
            courseSectionId: formData.courseSectionId,
            courseId: formData.courseId,
            moduleId: formData.moduleId,
            image: imageUrl,
          };
          break;
        default:
          break;
      }
  
      await axiosInstance.put(url, data);
  
      if (formData.archived) {
        let archiveUrl = '';
        switch (activeTab) {
          case 'courseSections':
            archiveUrl = `/contentManagement/archiveCourseSection/${selectedItem._id}`;
            break;
          case 'courses':
            archiveUrl = `/contentManagement/archiveCourse/${selectedItem._id}`;
            break;
          case 'modules':
            archiveUrl = `/contentManagement/archiveModule/${selectedItem._id}`;
            break;
          case 'units':
            archiveUrl = `/contentManagement/archiveUnit/${selectedItem._id}`;
            break;
          default:
            break;
        }
        await axiosInstance.put(archiveUrl);
      }
  
      setShowModal(false);
      fetchContent(); // Fetch updated content after editing
      setFormError(false);
      if (imageInput.current) {
        imageInput.current.value = ''; // Reset file input
      }
    } catch (error) {
      console.error('Error editing data:', error);
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-sf-regular">
        <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/2 text-gray-700">
        <h2 className="text-xl mb-4 font-sf-bold">
          {activeTab === 'courseSections' ? 'Edit Course Section' : `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
        </h2>
          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
          />
          {activeTab !== 'courseSections' && (
            <select
              value={formData.courseSectionId}
              onChange={(e) => setFormData({ ...formData, courseSectionId: e.target.value })}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Course Section</option>
              {courseSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.title}
                </option>
              ))}
            </select>
          )}
          {(activeTab === 'modules' || activeTab === 'units') && (
            <select
              value={formData.courseId}
              onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Course</option>
              {filteredCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
          {activeTab === 'units' && (
            <select
              value={formData.moduleId}
              onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Module</option>
              {filteredModules.map((module) => (
                <option key={module._id} value={module._id}>
                  {module.title}
                </option>
              ))}
            </select>
          )}
          {activeTab !== 'courseSections' && (
            <div>
              <label>
                Change photo:
                <input className='ml-2' type="file" ref={imageInput} />
              </label>
            </div>
          )}
          <div className="mb-4 mt-5">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={formData.archived}
                onChange={(e) => setFormData({ ...formData, archived: e.target.checked })}
                className="form-checkbox h-5 w-5 text-blue-500"
              />
              <span className="ml-2">Archive</span>
            </label>
          </div>
          {formError && <p className="text-red-500 text-sm mt-2">Please input all required fields.</p>}
          {imageError && (
            <p className="text-red-500 text-sm mt-2">Please select an image file (JPEG, PNG).</p>
          )}
          <div className='my-3 flex justify-end'>
            <button onClick={handleEdit} className="py-2 px-4 bg-blue-500 text-white mr-2">
              Save
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                setFormData({
                  title: selectedItem.title || '',
                  courseSectionId: selectedItem.courseSectionId?._id || '',
                  courseId: selectedItem.courseId?._id || '',
                  moduleId: selectedItem.moduleId?._id || '',
                  image: selectedItem.image || '',
                  archived: selectedItem.archived || false,
                }); // Reset form data
                if (imageInput.current) {
                  imageInput.current.value = ''; // Reset file input
                }
                setFormError(false)
                setImageError(false)
              }}
              className="py-2 px-4 bg-gray-500 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditContent;
