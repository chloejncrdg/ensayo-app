import express from "express"
import { createProgress, updateProgress, getProgress, getProgresses } from "../controllers/progress.js"
import { verifyToken } from "../verifyToken.js"

const router = express.Router()

// // Update progress route
// router.put('/:userId/:moduleId/:unitId', verifyToken, updateProgress);

router.put('/:userId/:moduleId/:unitId/:groupId/:groupType', verifyToken, updateProgress);

// Create progress route
router.post('/:userId/:moduleId/:unitId', verifyToken, createProgress);

// Get progress route
router.get('/:userId/:moduleId/:unitId', verifyToken, getProgress);

// Fetch all progress records of a user
router.get('/:userId', verifyToken, getProgresses)

export default router;