import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EditLesson = ({ activeTab, showModal, setShowModal, fetchContent, selectedItem }) => {
  const [formData, setFormData] = useState({
    title: '', 
    image:'', 
    courseSectionId: '', 
    courseId: '', 
    moduleId: '', 
    unitId: '', 
    toolGroupId: '', 
    simulationPath: '',
    name: '',
    description: '',
    modelPath: '',
    archived: false
  });
  const [courseSections, setCourseSections] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [toolGroups, setToolGroups] = useState([]);
  const [filteredToolGroups, setFilteredToolGroups] = useState([]);
  const [formError, setFormError] = useState(false);
  const [imageError, setImageError] = useState(false)

  const imageInput = useRef(null);
  const objectInput = useRef(null)

  const axiosInstance = axios.create({
    baseURL:process.env.REACT_APP_API_URL,
  });

  useEffect(() => {
    async function fetchOptions() {
      try {
        const [courseSectionsResponse, coursesResponse, modulesResponse, unitsResponse, toolGroupsResponse] = await Promise.all([
          axiosInstance.get('/contentManagement/getAllCourseSections'),
          axiosInstance.get('/contentManagement/getAllCourses'),
          axiosInstance.get('/contentManagement/getAllModules'),
          axiosInstance.get('/contentManagement/getAllUnits'),
          axiosInstance.get('/lessonManagement/getAllToolGroups')
        ]);

        setCourseSections(courseSectionsResponse.data.courseSections);
        setCourses(coursesResponse.data.courses);
        setModules(modulesResponse.data.modules);
        setUnits(unitsResponse.data.units);
        setToolGroups(toolGroupsResponse.data.toolGroups);
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
        image: selectedItem.image || '',
        courseSectionId: selectedItem.courseSectionId?._id || '',
        courseId: selectedItem.courseId?._id || '',
        moduleId: selectedItem.moduleId?._id || '',
        unitId: selectedItem.unitId?._id || '',
        toolGroupId: selectedItem.toolGroupId?._id || '',
        simulationPath: selectedItem.simulationPath || '',
        name: selectedItem.name || '',
        description: selectedItem.description || '',
        modelPath: selectedItem.modelPath || '',
        archived: selectedItem.archived || false
      });
    }
  }, [selectedItem]);

  useEffect(() => {
    if (formData.courseSectionId) {
      const filteredCourses = courses.filter(course => course.courseSectionId._id === formData.courseSectionId);
      setFilteredCourses(filteredCourses);
      setFilteredModules([]); // Reset modules when course section changes
      setFilteredUnits([]);
      setFilteredToolGroups([]);
    } else {
      setFilteredCourses([]);
    }
  }, [formData.courseSectionId, courses]);

  useEffect(() => {
    if (formData.courseId) {
      const filteredModules = modules.filter(module => module.courseId._id === formData.courseId);
      setFilteredModules(filteredModules);
      setFilteredUnits([]);
      setFilteredToolGroups([]);
    } else {
      setFilteredModules([]);
    }
  }, [formData.courseId, modules]);

  useEffect(() => {
    if (formData.moduleId) {
      const filteredUnits = units.filter(unit => unit.moduleId._id === formData.moduleId);
      setFilteredUnits(filteredUnits);
      setFilteredToolGroups([]);
    } else {
      setFilteredUnits([]);
    }
  }, [formData.moduleId, units]);

  useEffect(() => {
    if (formData.unitId) {
      const filteredToolGroups = toolGroups.filter(toolGroup => toolGroup.unitId._id === formData.unitId);
      setFilteredToolGroups(filteredToolGroups);
    } else {
      setFilteredToolGroups([]);
    }
  }, [formData.unitId, toolGroups]);

  const handleEdit = async () => {
    try {
      if (
        formData.courseSectionId === '' ||
        formData.courseId === '' ||
        formData.moduleId === '' ||
        formData.unitId === '' ||
        (activeTab === 'tools' && (formData.toolGroupId === '' || formData.description === ''))
      ) {
        setFormError(true);
        return;
      }

      if (!formData.title && !formData.name) {
        setFormError(true);
        return;
      }
  
      let url = '';
      let data = {};

      let imageUrl = formData.image;

      if (imageInput.current && imageInput.current.files.length > 0) {
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

      let objectUrl = formData.modelPath;

      if (objectInput.current && objectInput.current.files.length > 0) {

        const file = objectInput.current.files[0];
        const extension = file.name.split('.').pop();
        
        const uploadResponse = await axiosInstance.get(`/lessonManagement/uploadObject?extension=${extension}`);
        objectUrl = uploadResponse.data.url;
  

        await fetch(objectUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
  
        objectUrl = objectUrl.split('?')[0];  
      }
  
      switch (activeTab) {
        case 'toolGroups':
          url = `/lessonManagement/editToolGroup/${selectedItem._id}`;
          data = {
            title: formData.title,
            image: imageUrl,
            courseSectionId: formData.courseSectionId,
            courseId: formData.courseId,
            moduleId: formData.moduleId,
            unitId: formData.unitId,
            archived: formData.archived
          };
          break;
        case 'practicalGroups':
          url = `/lessonManagement/editPracticalGroup/${selectedItem._id}`;
          data = {
            title: formData.title,
            image: imageUrl,
            simulationPath: formData.simulationPath,
            courseSectionId: formData.courseSectionId,
            courseId: formData.courseId,
            moduleId: formData.moduleId,
            unitId: formData.unitId,
            archived: formData.archived
          };
          break;
        case 'tools':
          url = `/lessonManagement/editTool/${selectedItem._id}`;
          data = {
            name: formData.name,
            description: formData.description,
            modelPath: objectUrl,
            courseSectionId: formData.courseSectionId,
            courseId: formData.courseId,
            moduleId: formData.moduleId,
            unitId: formData.unitId,
            toolGroupId: formData.toolGroupId,
            archived: formData.archived
          };
          break;
        default:
          break;
      }
  
      await axiosInstance.put(url, data);

      if (formData.archived) {
        let archiveUrl = '';
        switch (activeTab) {
          case 'toolGroups':
            archiveUrl = `/lessonManagement/archiveToolGroup/${selectedItem._id}`;
            break;
          case 'practicalGroups':
            archiveUrl = `/lessonManagement/archivePracticalGroup/${selectedItem._id}`;
            break;
          case 'tools':
            archiveUrl = `/lessonManagement/archiveTool/${selectedItem._id}`;
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
      if (objectInput.current) {
        objectInput.current.value = ''; // Reset file input
      }
    } catch (error) {
      console.error('Error editing data:', error);
    }
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center font-sf-regular items-center">
        <div className="bg-white p-6 rounded shadow-lg w-full sm:w-1/2 text-gray-700">
          <h2 className="text-xl mb-4 font-sf-bold">
            {activeTab === 'toolGroups' ? 'Edit Tool Group' :
              activeTab === 'practicalGroups' ? 'Edit Practical' :
              `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
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
          </>
        )}

          {activeTab === 'practicalGroups' && (
            <>
              <input
                type="text"
                placeholder="Simulation Path"
                value={formData.simulationPath}
                onChange={(e) => setFormData({ ...formData, simulationPath: e.target.value })}
                className="mb-4 p-2 border border-gray-300 rounded w-full"
              />
            </>
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
              <div className='mb-3'>
                <label>
                  Change 3d Model:
                  <input
                    className='ml-2'
                    type="file"
                    ref={objectInput}
                  />
                </label>
              </div>
            </>
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
            <>
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
            </>
          )}

        {(activeTab === 'toolGroups' || activeTab === 'practicalGroups') && (
          <>
            <div>
              <label>
                Change Cover Photo:
                <input
                  className='ml-2'
                  type="file"
                  ref={imageInput}
                />
              </label>
            </div>
          </>
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
                  image: selectedItem.image || '',
                  courseSectionId: selectedItem.courseSectionId?._id || '',
                  courseId: selectedItem.courseId?._id || '',
                  moduleId: selectedItem.moduleId?._id || '',
                  unitId: selectedItem.unitId?._id || '',
                  toolGroupId: selectedItem.toolGroupId?._id || '',
                  simulationPath: selectedItem.simulationPath || '',
                  name: selectedItem.name || '',
                  description: selectedItem.description || '',
                  modelPath: selectedItem.modelPath || '',
                  archived: selectedItem.archived || false
                });
                if (imageInput.current) {
                  imageInput.current.value = ''; // Reset file input
                }
                if (objectInput.current) {
                  objectInput.current.value = ''; // Reset file input
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

export default EditLesson;
