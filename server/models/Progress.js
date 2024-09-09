import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
},
  moduleId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Module', 
    required: true 
},
  unitId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Unit', 
    required: true 
},
completedGroups: [{
  groupId: { type: mongoose.Schema.Types.ObjectId, required: true },
  groupType: { type: String, required: true, enum: ['ToolGroup', 'PracticalGroup'] }
}],
  progress: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
}
}, { timestamps: true });

const Progress = mongoose.model('Progress', ProgressSchema);

export default Progress;
