import mongoose from 'mongoose';
import { CourseSection, Course, Module, Unit, ToolGroup, PracticalGroup, Tool } from '../models/Content.js';
import { updateProgressForAll } from "./progress.js"


// CREATE COURSE SECTION
const createCourseSection = async (req, res, next) => {
    try {
        const { title } = req.body;
        const existingCourseSection = await CourseSection.findOne({ title });

        if (existingCourseSection) {
            return res.status(400).json({ error: 'Course section with this name already exists' });
        }

        const newCourseSection = new CourseSection(req.body);
        const savedCourseSection = await newCourseSection.save();
        res.status(201).json(savedCourseSection);
    } catch (error) {
        next(error);
    }
};


// CREATE COURSE
const createCourse = async (req, res) => {
    const { courseSectionId } = req.params;
    try {
        const isValidObjectId = mongoose.isValidObjectId(courseSectionId);
        if (!isValidObjectId) {
            return res.status(404).json({ message: 'Invalid CourseSectionId' });
        }

        const courseSection = await CourseSection.findById(courseSectionId);
        if (!courseSection) {
            return res.status(404).json({ message: 'CourseSection not found' });
        }

        // Create a new course with the courseSectionId and save it to the database
        const newCourse = new Course({ ...req.body, courseSectionId });
        const savedCourse = await newCourse.save(); // Save the new course to the database

        res.status(201).json(savedCourse); // Respond with the created course
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const createModule = async (req, res) => {
    const { courseId } = req.params;
    try {
        // Validate the courseId
        const isValidCourseId = mongoose.isValidObjectId(courseId);
        if (!isValidCourseId) {
            return res.status(404).json({ message: 'Invalid CourseId' });
        }

        // Check if the course with the given ID exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Get the courseSectionId from the course
        const courseSectionId = course.courseSectionId;

        // Check if the course section with the given ID exists
        const courseSection = await CourseSection.findById(courseSectionId);
        if (!courseSection) {
            return res.status(404).json({ message: 'CourseSection not found' });
        }

        // Create a new module with the courseSectionId and courseId
        const newModule = new Module({ ...req.body, courseSectionId, courseId });
        const savedModule = await newModule.save(); // Save the new module to the database

        res.status(201).json(savedModule); // Respond with the created module
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



const createUnit = async (req, res) => {
    const { moduleId } = req.params;
    try {
        // Validate the moduleId
        const isValidModuleId = mongoose.isValidObjectId(moduleId);
        if (!isValidModuleId) {
            return res.status(404).json({ message: 'Invalid ModuleId' });
        }

        // Check if the module with the given ID exists
        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Get the courseId and courseSectionId from the module
        const courseId = module.courseId;
        const courseSectionId = module.courseSectionId;

        // Check if the course with the given ID exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the course section with the given ID exists
        const courseSection = await CourseSection.findById(courseSectionId);
        if (!courseSection) {
            return res.status(404).json({ message: 'CourseSection not found' });
        }

        // Create a new unit with the courseSectionId, courseId, and moduleId
        const newUnit = new Unit({ ...req.body, courseSectionId, courseId, moduleId });
        const savedUnit = await newUnit.save(); // Save the new unit to the database

        res.status(201).json(savedUnit); // Respond with the created unit
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


const createToolGroup = async (req, res) => {
    const { unitId } = req.params;
    try {
        // Validate the unitId
        const isValidUnitId = mongoose.isValidObjectId(unitId);
        if (!isValidUnitId) {
            return res.status(404).json({ message: 'Invalid UnitId' });
        }

        // Check if the unit with the given ID exists
        const unit = await Unit.findById(unitId);
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        // Get the courseId, courseSectionId, and moduleId from the unit
        const courseId = unit.courseId;
        const courseSectionId = unit.courseSectionId;
        const moduleId = unit.moduleId;

        // Check if the course with the given ID exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the course section with the given ID exists
        const courseSection = await CourseSection.findById(courseSectionId);
        if (!courseSection) {
            return res.status(404).json({ message: 'CourseSection not found' });
        }

        // Check if the module with the given ID exists
        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Create a new tool group with the courseSectionId, courseId, moduleId, and unitId
        const newToolGroup = new ToolGroup({ ...req.body, courseSectionId, courseId, moduleId, unitId });
        const savedToolGroup = await newToolGroup.save(); // Save the new tool group to the database
        
        await updateProgressForAll(unitId);

        res.status(201).json(savedToolGroup); // Respond with the created tool group
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createTool = async (req, res) => {
    const { toolGroupId } = req.params;
    try {
        // Validate the toolGroupId
        const isValidToolGroupId = mongoose.isValidObjectId(toolGroupId);
        if (!isValidToolGroupId) {
            return res.status(404).json({ message: 'Invalid ToolGroupId' });
        }

        // Check if the tool group with the given ID exists
        const toolGroup = await ToolGroup.findById(toolGroupId);
        if (!toolGroup) {
            return res.status(404).json({ message: 'ToolGroup not found' });
        }

        // Get the courseId, courseSectionId, moduleId, and unitId from the tool group
        const { unitId, moduleId, courseId, courseSectionId } = toolGroup;

        // Validate the existence of the related documents
        const [unit, module, course, courseSection] = await Promise.all([
            Unit.findById(unitId),
            Module.findById(moduleId),
            Course.findById(courseId),
            CourseSection.findById(courseSectionId),
        ]);

        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (!courseSection) {
            return res.status(404).json({ message: 'CourseSection not found' });
        }

        // Create a new tool with the necessary references
        const newTool = new Tool({
            ...req.body,
            toolGroupId,
            unitId,
            moduleId,
            courseId,
            courseSectionId
        });
        const savedTool = await newTool.save(); // Save the new tool to the database

        // Push the new tool into the tools array of the tool group
        toolGroup.tools.push(savedTool);
        await toolGroup.save();
        res.status(201).json(savedTool); // Respond with the created tool
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createPracticalGroup = async (req, res) => {
    const { unitId } = req.params;
    try {
        // Validate the unitId
        const isValidUnitId = mongoose.isValidObjectId(unitId);
        if (!isValidUnitId) {
            return res.status(404).json({ message: 'Invalid UnitId' });
        }

        // Check if the unit with the given ID exists
        const unit = await Unit.findById(unitId);
        if (!unit) {
            return res.status(404).json({ message: 'Unit not found' });
        }

        // Get the courseId, courseSectionId, and moduleId from the unit
        const courseId = unit.courseId;
        const courseSectionId = unit.courseSectionId;
        const moduleId = unit.moduleId;

        // Check if the course with the given ID exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Check if the course section with the given ID exists
        const courseSection = await CourseSection.findById(courseSectionId);
        if (!courseSection) {
            return res.status(404).json({ message: 'CourseSection not found' });
        }

        // Check if the module with the given ID exists
        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: 'Module not found' });
        }

        // Create a new practical group with the courseSectionId, courseId, moduleId, and unitId
        const newPracticalGroup = new PracticalGroup({ ...req.body, courseSectionId, courseId, moduleId, unitId });
        const savedPracticalGroup = await newPracticalGroup.save(); // Save the new practical group to the database

        await updateProgressForAll(unitId);
        
        res.status(201).json(savedPracticalGroup); // Respond with the created practical group
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export { 
    createCourseSection, 
    createCourse, 
    createModule, 
    createUnit, 
    createToolGroup, 
    createPracticalGroup,
    createTool };
