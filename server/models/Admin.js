import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    archived: { 
        type: Boolean, 
        default: false 
    }
}, 
{ timestamps: true }
)

export default mongoose.model("Admin", AdminSchema)