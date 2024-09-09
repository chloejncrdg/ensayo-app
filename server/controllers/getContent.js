import mongoose from 'mongoose';
import { CourseSection, Course, Module, Unit, ToolGroup, PracticalGroup, Tool } from '../models/Content.js';

const getAllCourseSections = async (req, res) => {
    try {
        const courseSections = await CourseSection.find({ archived: false });
        res.status(200).json(courseSections);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCourseSectionById = async (req, res) => {
    const { id } = req.params;
    try {
        const courseSection = await CourseSection.findById(id);
        if (!courseSection || courseSection.archived) {
            return res.status(404).json({ message: 'Course section not found' });
        }
        res.status(200).json(courseSection);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// gets all courses based on the course section Id
const getAllCourses = async (req, res) => {
    const { courseSectionId } = req.params;
    try {
        // Validate the courseSectionId
        const isValidCourseSectionId = mongoose.isValidObjectId(courseSectionId);
        if (!isValidCourseSectionId) {
            return res.status(404).json({ message: 'Invalid CourseSectionId' });
        }

        // Find all courses with the specified courseSectionId
        const courses = await Course.find({ courseSectionId, archived: false });

        res.status(200).json(courses); // Respond with the found courses
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllModules = async (req, res) => {
    const { courseId } = req.params;
    try {
        // Validate the courseId
        const isValidCourseId = mongoose.isValidObjectId(courseId);
        if (!isValidCourseId) {
            return res.status(404).json({ message: 'Invalid CourseId' });
        }

        // Find all modules with the specified courseId
        const modules = await Module.find({ courseId, archived: false });
        const course = await Course.findById(courseId);

        res.status(200).json({ modules, course }); // Respond with the found modules
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllUnits = async (req, res) => {
    const { moduleId } = req.params;
    try {
        // Validate the moduleId
        const isValidModuleId = mongoose.isValidObjectId(moduleId);
        if (!isValidModuleId) {
            return res.status(404).json({ message: 'Invalid ModuleId' });
        }

        // Find all units with the specified moduleId
        const units = await Unit.find({ moduleId, archived: false });
        const module = await Module.findById(moduleId)

        res.status(200).json({ units, module}); // Respond with the found units
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllToolGroups = async (req, res) => {
    const { unitId } = req.params;
    try {
        // Validate the unitId
        const isValidUnitId = mongoose.isValidObjectId(unitId);
        if (!isValidUnitId) {
            return res.status(404).json({ message: 'Invalid UnitId' });
        }

        // Find all tool groups with the specified unitId
        const toolGroups = await ToolGroup.find({ unitId, archived: false });
        const unit = await Unit.findById(unitId)

        res.status(200).json({ toolGroups, unit }); // Respond with the found tool groups
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllPracticalGroups = async (req, res) => {
    const { unitId } = req.params;
    try {
        // Validate the unitId
        const isValidUnitId = mongoose.isValidObjectId(unitId);
        if (!isValidUnitId) {
            return res.status(404).json({ message: 'Invalid UnitId' });
        }

        // Find all practical groups with the specified unitId
        const practicalGroups = await PracticalGroup.find({ unitId, archived: false });
        const unit = await Unit.findById(unitId)

        res.status(200).json({ practicalGroups, unit }); // Respond with the found practical groups
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const getAllTools = async (req, res) => {
    const { toolGroupId } = req.params;
    try {
        // Validate the toolGroupId
        const isValidToolGroupId = mongoose.isValidObjectId(toolGroupId);
        if (!isValidToolGroupId) {
            return res.status(404).json({ message: 'Invalid ToolGroupId' });
        }

        // Find all tools with the specified toolGroupId
        const tools = await Tool.find({ toolGroupId, archived: false });
        const toolGroup = await ToolGroup.findById(toolGroupId)
        const unitId = tools.length > 0 ? tools[0].unitId : null;

        // Fetch the unit information
        const unit = unitId ? await Unit.findById(unitId) : null;


        res.status(200).json({ tools, toolGroup, unit }); // Respond with the found tools
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



export { 
    getAllCourseSections, 
    getCourseSectionById, 
    getAllCourses, 
    getAllModules, 
    getAllUnits, 
    getAllToolGroups,
    getAllPracticalGroups, 
    getAllTools
 };
