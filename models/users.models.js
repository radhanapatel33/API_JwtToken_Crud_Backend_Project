import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true

    },
    createAt:{
        type: Date,
        default: Date.now
    }

});

const user = mongoose.model(process.env.MONGODB_COLLECTION_USER, userSchema);
export default user;
