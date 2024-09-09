import express from "express"
import { 
    addCourseSection,
    addCourse,
    addModule,
    addUnit,
    getAllCourseSections, 
    getAllCourses, 
    getAllModules, 
    getAllUnits,
    editCourseSection,
    editCourse,
    editModule,
    editUnit,
    archiveCourseSection,
    archiveCourse,
    archiveModule,
    archiveUnit,
    uploadImage
 } from "../controllers/adminContentManagement.js"


const router = express.Router()

// CREATE
router.post("/addCourseSection", addCourseSection)
router.post("/addCourse", addCourse)
router.post("/addModule", addModule)
router.post("/addUnit", addUnit)

// RETRIEVE
router.get("/getAllCourseSections", getAllCourseSections)
router.get("/getAllCourses", getAllCourses)
router.get("/getAllModules", getAllModules)
router.get("/getAllUnits", getAllUnits)
router.get("/uploadImage", uploadImage)

// UPDATE
router.put('/editCourseSection/:id', editCourseSection);
router.put('/editCourse/:id', editCourse);
router.put('/editModule/:id', editModule);
router.put('/editUnit/:id', editUnit);

// DELETE
router.put('/archiveCourseSection/:id', archiveCourseSection);
router.put('/archiveCourse/:id', archiveCourse);
router.put('/archiveModule/:id', archiveModule);
router.put('/archiveUnit/:id', archiveUnit);


export default router;