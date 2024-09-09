import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const AddLesson = ({ activeTab, showModal, setShowModal, fetchContent }) => {
  const [formData, setFormData] = useState({ 
    title: '', 
    image:'', 
    courseSectionId: '', 
    courseId: '', 
    moduleId: '', 
    unitId: '', 
    toolGroupId: '', 
    practicalSimulation: '',
    name: '',
    description: '',
    modelPath: ''
  });
  const [courseSections, setCourseSections] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [allToolGroups, setAllToolGroups] = useState([]);
  const [filteredToolGroups, setFilteredToolGroups] = useState([]);
  const [formError, setFormError] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageInput = useRef(null)
  const objectInput = useRef(null)

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const courseSectionsResponse = await axiosInstance.get('/contentManagement/getAllCourseSections');
        setCourseSections(courseSectionsResponse.data.courseSections);

        const coursesResponse = await axiosInstance.get('/contentManagement/getAllCourses');
        setAllCourses(coursesResponse.data.courses);

        const modulesResponse = await axiosInstance.get('/contentManagement/getAllModules');
        setAllModules(modulesResponse.data.modules);

        const unitsResponse = await axiosInstance.get('/contentManagement/getAllUnits');
        setAllUnits(unitsResponse.data.units);

        const toolGroupsResponse = await axiosInstance.get('/lessonManagement/getAllToolGroups');
        setAllToolGroups(toolGroupsResponse.data.toolGroups);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    if (showModal) {
      fetchOptions();
    }
  }, [showModal]);

  useEffect(() => {
    if (formData.courseSectionId) {
      const newFilteredCourses = allCourses.filter(course => course.courseSectionId._id === formData.courseSectionId);
      setFilteredCourses(newFilteredCourses);
      setFilteredModules([]); // Reset modules when course section changes
    } else {
      setFilteredCourses([]);
    }
  }, [formData.courseSectionId, allCourses]);

  useEffect(() => {
    if (formData.courseId) {
      const newFilteredModules = allModules.filter(module => module.courseId._id === formData.courseId);
      setFilteredModules(newFilteredModules);
      setFilteredUnits([]); // Reset units when course changes
    } else {
      setFilteredModules([]);
    }
  }, [formData.courseId, allModules]);

  useEffect(() => {
    if (formData.moduleId) {
      const newFilteredUnits = allUnits.filter(unit => unit.moduleId._id === formData.moduleId);
      setFilteredUnits(newFilteredUnits);
    } else {
      setFilteredUnits([]);
    }
  }, [formData.moduleId, allUnits]);

  useEffect(() => {
    if (formData.unitId) {
      const newFilteredToolGroups = allToolGroups.filter(group => group.unitId._id === formData.unitId);
      setFilteredToolGroups(newFilteredToolGroups);
    } else {
      setFilteredToolGroups([]);
    }
  }, [formData.unitId, allToolGroups]);

  const handleAdd = async () => {
    try {
      if (activeTab === 'toolGroups') {

        if ( !formData.title || !formData.courseSectionId || !formData.courseId || !formData.moduleId || 
             !formData.unitId)   
        {
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

        await axiosInstance.post('/lessonManagement/addToolGroup', { 
          courseSectionId: formData.courseSectionId,
          courseId: formData.courseId,
          moduleId: formData.moduleId,            
          unitId: formData.unitId,
          title: formData.title,
          image: imageUrl || null
        });

      } else if (activeTab === 'practicalGroups') {

        if ( !formData.title || !formData.courseSectionId || !formData.courseId || !formData.moduleId || 
          !formData.unitId)   
        {
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

        await axiosInstance.post('/lessonManagement/addPracticalGroup', { 
          courseSectionId: formData.courseSectionId,
          courseId: formData.courseId,
          moduleId: formData.moduleId,
          unitId: formData.unitId,
          title: formData.title,
          image: imageUrl || null,
          simulationPath: formData.practicalSimulation
        });
    
      } else if (activeTab === 'tools') {

        if ( !formData.name || !formData.description || !formData.courseSectionId || !formData.courseId || 
          !formData.moduleId || !formData.unitId || !formData.toolGroupId || !objectInput.current.files[0]) 
        {
          setFormError(true);
          return;
        }

        const file = objectInput.current.files[0];
        const extension = file.name.split('.').pop();


        const uploadResponse = await axiosInstance.get(`/lessonManagement/uploadObject?extension=${extension}`);
        const url = uploadResponse.data.url;

        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type
          },
          body: file
        });

        const objectUrl = url.split('?')[0];

        await axiosInstance.post('/lessonManagement/addTool', { 
          courseSectionId: formData.courseSectionId,
          courseId: formData.courseId,
          moduleId: formData.moduleId,
          unitId: formData.unitId,
          toolGroupId: formData.toolGroupId,
          name: formData.name,
          description: formData.description,
          modelPath: objectUrl 
        });
      }

      setShowModal(false);
      setFormData({ 
        title: '', 
        image:'', 
        courseSectionId: '', 
        courseId: '', 
        moduleId: '', 
        unitId: '', 
        toolGroupId: '', 
        practicalSimulation: '',
        name: '',
        description: '',
        modelPath: '' });

      if (imageInput.current) {
          imageInput.current.value = '';
      }

      if (objectInput.current) {
        objectInput.current.value = '';
      }

      fetchContent();
      setFormError(false);

    } catch (error) {
      console.error('Error adding data:', error);
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center font-sf-regular items-center">
        <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/2 text-gray-700">
        <h2 className="text-xl mb-4 font-sf-bold">
          {activeTab === 'toolGroups' ? 'Add Tool Group' :
            activeTab === 'practicalGroups' ? 'Add Practical' :
            `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
          }
        </h2>
          {(activeTab === 'toolGroups' || activeTab === 'practicalGroups') && (
          <>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />

            <div className='mb-5'>
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
  
          {activeTab === 'practicalGroups' && (
              <input
              type="text"
              placeholder="Simulation Path"
              value={formData.practicalSimulation}
              onChange={(e) => setFormData({ ...formData, practicalSimulation: e.target.value })}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
          )}

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

          <select
            value={formData.unitId}
            onChange={(e) => setFormData({ ...formData, unitId: e.target.value })}
            className="mb-4 p-2 border border-gray-300 rounded w-full"
          >
            <option value="">Select Unit</option>
            {filteredUnits.map((unit) => (
              <option key={unit._id} value={unit._id}>
                {unit.title}
              </option>
            ))}
          </select>

          {activeTab === 'tools' && (
            <select
              value={formData.toolGroupId}
              onChange={(e) => setFormData({ ...formData, toolGroupId: e.target.value })}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Tool Group</option>
              {filteredToolGroups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.title}
                </option>
              ))}
            </select>
          )}

          {activeTab === 'tools' && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />

              <div className='mb-5'>
                <label>
                  3D Model:
                  <input
                    className='ml-2'
                    type="file"
                    ref={objectInput}
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
                setFormData({ 
                  title: '', 
                  image: '', 
                  courseSectionId: '', 
                  courseId: '', 
                  moduleId: '', 
                  unitId: '', 
                  toolGroupId: '', 
                  practicalSimulation: '',
                  name: '',
                  description: '',
                  modelPath: '' 
                });
                setFormError(false);
                setImageError(false)
                if (imageInput.current) {
                  imageInput.current.value = ''; // Reset file input
                }    
                if (objectInput.current) {
                  objectInput.current.value = ''; // Reset file input
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

export default AddLesson;
