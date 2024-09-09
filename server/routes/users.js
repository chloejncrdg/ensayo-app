import express from "express"
import { 
    deleteUser, 
    getUser, 
    getUserEnrolledModules,
    updateUser, 
    updateUsername, 
    updatePassword, 
    updateEmail, 
    updateUserCourses,
    sendPasswordResetLink,
    verifyResetPasswordToken,
    verifyTokenAndResetPassword
 } from "../controllers/user.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

// Send password reset link
router.post('/forgot-password', sendPasswordResetLink);

// verify reset password token 
router.post('/verify-token', verifyResetPasswordToken);

// Verify token again and reset password
router.post('/reset-password', verifyTokenAndResetPassword);

// update user
router.put("/:id", verifyToken, updateUser)

// update username
router.put("/:id/username", verifyToken, updateUsername)

// update password
router.put('/:id/password', verifyToken, updatePassword);

// update email
router.put('/:id/email', verifyToken, updateEmail);

// delete user
router.delete("/:id", verifyToken, deleteUser)

// get a user 
router.get("/find/:id", getUser)

// get module details of enrolledCourses of a user 
router.get("/:id/modulesList", verifyToken, getUserEnrolledModules)

// add module to enrolledCourses of a user
router.put("/:id/courses", verifyToken, updateUserCourses);

export default router