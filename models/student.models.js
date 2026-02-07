import mongoose from "mongoose";
const studentSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        unique: true
    },
    student_name: {
        type: String,
        required: true
    },
    student_age: {
        type: Number,
        required: true
    },
    student_email: {
        type: String,
        required: true,
        unique: true
    },
    student_phone: {
        type: Number,
        required: true,
        unique: true
    },
    student_gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    student_photo: {
        type: String,
        
    }
});

const Student = mongoose.model(process.env.MONGODB_COLLECTION_NAME, studentSchema);
export default Student;
