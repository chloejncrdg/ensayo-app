import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
    address:{
        type: String,
        required: true,
    },
    // enrolledCourses:{
    //     type: [String],
    // }
    enrolledCourses: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Module' }
    ],
    resetToken: { // Add this line
        type: String,
        default: null,
    },
}, 
{ timestamps: true }
)

UserSchema.index({ firstName: 'text', lastName: 'text', username: 'text', email: 'text' });

export default mongoose.model("User", UserSchema)