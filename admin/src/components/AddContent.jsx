import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddContent = ({ activeTab, showModal, setShowModal, fetchContent }) => {
  const [formData, setFormData] = useState({ title: '', courseSectionId: '', courseId: '', moduleId: '', image: '', unitId: '' });
  const [courseSections, setCourseSections] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([])
  const [formError, setFormError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageInput = useRef(null)

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const courseSectionsResponse = await axiosInstance.get('/contentManagement/getAllCourseSections');
        setCourseSections(courseSectionsResponse.data.courseSections);

        const coursesResponse = await axiosInstance.get('/contentManagement/getAllCourses');
        setCourses(coursesResponse.data.courses);

        const modulesResponse = await axiosInstance.get('/contentManagement/getAllModules');
        setModules(modulesResponse.data.modules);
      } catch (error) {
        console.error('Error fetching course sections and courses:', error);
      }
    }

    // Fetch options when component mounts or when showModal is true
    if (!courseSections.length || !courses.length || !modules.length) {
      fetchOptions();
    }

    // Fetch options specifically when switching to 'units' tab
    if (activeTab === 'units') {
      fetchOptions();
    }
  }, [showModal, activeTab, courseSections.length, courses.length, modules.length]);

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


  const handleAdd = async () => {
    try {
      if (activeTab === 'courseSections') {
        if (!formData.title) {
          setFormError(true);
          return;
        }
        await axiosInstance.post('/contentManagement/addCourseSection', { title: formData.title });
      } else if (activeTab === 'courses') {
        if (!formData.courseSectionId || !formData.title) {
          setFormError(true);
          return;
        }

        const file = imageInput.current.files[0];
        let imageUrl = null;
    
        if (file) {
          const allowedTypes = ['image/jpeg', 'image/png']; // Allowed image types
      
          if (!allowedTypes.includes(file.type)) {
            setImageError(true);
            return;
          }
      
          const uploadResponse = await axiosInstance.get('/contentManagement/uploadImage');
          const url = uploadResponse.data.url;
      
          await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type
            },
            body: file
          });
      
          imageUrl = url.split('?')[0];
        }

        await axiosInstance.post('/contentManagement/addCourse', {
          courseSectionId: formData.courseSectionId,
          title: formData.title,
          image: imageUrl || null
        });
      } else if (activeTab === 'modules') {
        if (!formData.courseSectionId || !formData.courseId || !formData.title) {
          setFormError(true);
          return;
        }

        const file = imageInput.current.files[0];
        let imageUrl = null;
    
        if (file) {
          const allowedTypes = ['image/jpeg', 'image/png']; // Allowed image types
      
          if (!allowedTypes.includes(file.type)) {
            setImageError(true);
            return;
          }
      
          const uploadResponse = await axiosInstance.get('/contentManagement/uploadImage');
          const url = uploadResponse.data.url;
      
          await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type
            },
            body: file
          });
      
          imageUrl = url.split('?')[0];
        }

        await axiosInstance.post('/contentManagement/addModule', {
          courseSectionId: formData.courseSectionId,
          courseId: formData.courseId,
          title: formData.title,
          image: imageUrl || null
        });
        
      } else if (activeTab === 'units') {
        if (!formData.unitId || !formData.courseSectionId || !formData.courseId || !formData.moduleId || !formData.title) {
          setFormError(true);
          return;
        }

        const file = imageInput.current.files[0];
        let imageUrl = null;
    
        if (file) {
          const allowedTypes = ['image/jpeg', 'image/png']; // Allowed image types
      
          if (!allowedTypes.includes(file.type)) {
            setImageError(true);
            return;
          }
      
          const uploadResponse = await axiosInstance.get('/contentManagement/uploadImage');
          const url = uploadResponse.data.url;
      
          await fetch(url, {
            method: 'PUT',
            headers: {
              'Content-Type': file.type
            },
            body: file
          });
      
          imageUrl = url.split('?')[0];
        }

        await axiosInstance.post('/contentManagement/addUnit', {
          unitId: formData.unitId,
          courseSectionId: formData.courseSectionId,
          courseId: formData.courseId,
          moduleId: formData.moduleId,
          title: formData.title,
          image: imageUrl || null
        });
      }
      setShowModal(false);
      setFormData({ title: '', courseSectionId: '', courseId: '', moduleId: '', image: '', unitId: '' });
        if (imageInput.current) {
          imageInput.current.value = '';
      }
      fetchContent(); // Fetch updated content after adding
      setFormError(false);
    } catch (error) {
      console.error('Error adding data:', error);
    }
  };
  

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center font-sf-regular text-gray-700">
        <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/2">
        <h2 className="text-xl mb-4 font-sf-bold">
          {activeTab === 'courseSections' ? 'Add Course Section' : `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
        </h2>
          {activeTab === 'courseSections' && (
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
          )}
          {activeTab === 'courses' && (
            <>
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
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <div>
                <label>
                  Cover Photo:
                  <input
                    className='ml-2'
                    type="file"
                    ref={imageInput}
                  />
                </label>
              </div>
            </>
          )}
          {activeTab === 'modules' && (
            <>
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
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <div>
                <label>
                  Cover Photo:
                  <input
                    className='ml-2'
                    type="file"
                    ref={imageInput}
                  />
                </label>
              </div>
            </>
          )}
          {activeTab === 'units' && (
            <>
              <input
                type="number"
                placeholder="Unit ID"
                value={formData.unitId}
                onChange={(e) => setFormData({ ...formData, unitId: +e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
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
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
              <div>
                <label>
                  Cover Photo:
                  <input
                    className='ml-2'
                    type="file"
                    ref={imageInput}
                  />
                </label>
              </div>
            </>
          )}
          {formError && (
            <p className="text-red-500 text-sm mt-2">Please input all required fields.</p>
          )}
          {imageError && (
            <p className="text-red-500 text-sm mt-2">Please select an image file (JPEG, PNG).</p>
          )}
          <div className='my-3 flex justify-end'>
            <button onClick={handleAdd} className="py-2 px-4 bg-blue-500 text-white mr-2">
              Add
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                setFormData({ title: '', courseSectionId: '', courseId: '', moduleId: '', image: '', unitId: '' }); // Reset form data
                setFormError(false); // Reset form error when modal is closed
                setImageError(false)
                if (imageInput.current) {
                  imageInput.current.value = ''; // Reset file input
                }    
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

export default AddContent;