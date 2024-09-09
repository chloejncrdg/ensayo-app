import express from "express"
import { 
    countTotalUsers, 
    countUsersWithEnrolledCourses, 
    countUsersEnrolledInCourses, 
    getAllUsers,
    getUserDetails
 } from "../controllers/adminUserManagement.js"

import { verifyAdminToken } from "../verifyAdminToken.js"

const router = express.Router()

router.get("/countTotalUsers", countTotalUsers)
router.get("/countEnrolledUsers", countUsersWithEnrolledCourses)
router.get("/courseEnrollees", countUsersEnrolledInCourses)
router.get("/getUsers", getAllUsers)
router.get("/getUserDetails/:userId", getUserDetails)

export default router;