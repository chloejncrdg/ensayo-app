import express from "express"
import { 
    addToolGroup,
    addPracticalGroup,
    addTool,
    uploadObject,
    getAllToolGroups,
    getAllPracticalGroups,
    getAllTools,
    editToolGroup,
    editPracticalGroup,
    editTool,
    archiveToolGroup,
    archivePracticalGroup,
    archiveTool
} from "../controllers/adminLessonManagement.js"

import { verifyAdminToken } from "../verifyAdminToken.js"

const router = express.Router()


// CREATE
router.post("/addToolGroup", addToolGroup)
router.post("/addPracticalGroup", addPracticalGroup)
router.post("/addTool", addTool)

// RETRIEVE
router.get("/uploadObject", uploadObject)
router.get("/getAllToolGroups", getAllToolGroups)
router.get("/getAllPracticalGroups", getAllPracticalGroups)
router.get("/getAllTools", getAllTools)

// UPDATE
router.put("/editToolGroup/:id", editToolGroup)
router.put("/editPracticalGroup/:id", editPracticalGroup)
router.put("/editTool/:id", editTool)

// DELETE (ARCHIVE)
router.put("/archiveToolGroup/:id", archiveToolGroup)
router.put("/archivePracticalGroup/:id", archivePracticalGroup)
router.put("/archiveTool/:id", archiveTool)



export default router;