import express from "express"
import { 
    createCourseSection, 
    createCourse, 
    createModule, 
    createUnit, 
    createToolGroup, 
    createPracticalGroup,
    createTool
 } from "../controllers/createContent.js"

import { 
    getAllCourseSections, 
    getCourseSectionById,
    getAllCourses,
    getAllModules,
    getAllUnits,
    getAllToolGroups,
    getAllPracticalGroups,
    getAllTools
 } from "../controllers/getContent.js";



const router = express.Router()

// CREATE CONTENT

// CREATE COURSE SECTION
router.post('/course-sections', createCourseSection);
// CREATE COURSE
router.post('/course-sections/:courseSectionId/courses', createCourse);
// CREATE MODULE
router.post('/courses/:courseId/modules', createModule);
// CREATE UNIT
router.post('/modules/:moduleId/units', createUnit);
// CREATE TOOL GROUP
router.post('/units/:unitId/tool-groups', createToolGroup);
// CREATE PRACTICAL GROUP
router.post('/units/:unitId/practical-groups', createPracticalGroup);
// CREATE TOOL
router.post('/tool-groups/:toolGroupId/tools', createTool);


// GET CONTENT

// GET COURSE SECTIONS
router.get('/course-sections', getAllCourseSections);
router.get('/course-sections/:id', getCourseSectionById);
// GET COURSES
router.get('/courses/:courseSectionId', getAllCourses);
// GET MODULES
router.get('/modules/:courseId', getAllModules);
// GET UNITS
router.get('/units/:moduleId', getAllUnits);
// GET TOOL GROUPS
router.get('/tool-groups/:unitId', getAllToolGroups);
// GET PRACTICAL GROUPS
router.get('/practical-groups/:unitId', getAllPracticalGroups);
// GET TOOLS
router.get('/tools/:toolGroupId', getAllTools);



export default router