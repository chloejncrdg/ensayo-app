import mongoose from "mongoose";

// Tool Schema
const ToolSchema = new mongoose.Schema({
    // toolId: { type: Number, required: true },
    toolGroupId: { type: mongoose.Schema.Types.ObjectId, ref: 'ToolGroup', required: true },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
    name: { type: String, required: true },
    modelPath: { type: String },
    description: { type: String, required: true },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

// ToolGroup Schema
const ToolGroupSchema = new mongoose.Schema({
    // toolGroupId: { type: Number, required: true },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
    title: { type: String, required: true },
    image: { type: String, default: null },
    tools: { type: [ToolSchema], default: [] },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

// PracticalGroup Schema
const PracticalGroupSchema = new mongoose.Schema({
    // practicalGroupId: { type: Number, required: true },
    unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
    title: { type: String, required: true },
    image: { type: String, default: null },
    simulationPath: { type: String },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

// Unit Schema
const UnitSchema = new mongoose.Schema({
    unitId: { type: Number, required: true },
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
    title: { type: String, required: true },
    image: { type: String, default: null },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

// Module Schema
const ModuleSchema = new mongoose.Schema({
    // moduleId: { type: Number, required: true },
    courseId: {  type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    courseSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
    title: { type: String, required: true },
    image: { type: String, default: null },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

// Course Schema
const CourseSchema = new mongoose.Schema({
    // courseId: { type: Number, required: true },
    courseSectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CourseSection', required: true },
    title: { type: String, required: true },
    image: { type: String, default: null },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

// CourseSection Schema
const CourseSectionSchema = new mongoose.Schema({
    // courseSectionId: { type: Number, required: true },
    title: { type: String, required: true },
    archived: { type: Boolean, default: false }
}, { timestamps: true });

// Models
const Tool = mongoose.model("Tool", ToolSchema);
const ToolGroup = mongoose.model("ToolGroup", ToolGroupSchema);
const PracticalGroup = mongoose.model("PracticalGroup", PracticalGroupSchema);
const Unit = mongoose.model("Unit", UnitSchema);
const Module = mongoose.model("Module", ModuleSchema);
const Course = mongoose.model("Course", CourseSchema);
const CourseSection = mongoose.model("CourseSection", CourseSectionSchema);

export { Tool, ToolGroup, PracticalGroup, Unit, Module, Course, CourseSection };
