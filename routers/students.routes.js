import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
const router = express.Router();
import studentModel from '../models/student.models.js';

const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        let newFile = Date.now() + path.extname(file.originalname);
        cb(null, newFile)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    }
    else if (file.mimetype.startsWith('application/pdf')) {
        cb(null, true)
    }
    else {
        cb(new Error('Only images are allowed!'), false)
    }

}


const upload = multer({
    storage: Storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 100 }
});

//pagination API

router.get('/Page', async (req, res) => {
    try {
        const { page = 1, limit = 2 } = req.query;
        const skip = (page - 1) * limit;

        const data = await studentModel.find().skip(skip).limit(Number(limit));
        res.json({
            data
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Insert Data API

router.post('/', upload.single('student_photo'), async (req, res) => {
    try {
        if (req.file) {
            req.body.student_photo = req.file.filename
        }
        let data = await studentModel.create(req.body);
        console.log(data);
        res.status(201).json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read all data API
router.get('/', async (req, res) => {
    try {
        let data = await studentModel.find(req.body);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Read one data api
router.get('/:_id', async (req, res) => {
    try {
        let data = await studentModel.findById(req.params._id);
        if (!data) res.status(404).json({ message: "Student Data Not found" })
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//update Data Api

router.put('/:_id', upload.single('student_photo'), async (req, res) => {
    try {
        let existingStudent = await studentModel.findById(req.params._id);

        //Image update
        if (req.file) {
            if (existingStudent.student_photo) {
                let oldFilePath = path.join('./uploads', existingStudent.student_photo);
                fs.unlink(oldFilePath, (err) => {
                    if (err) console.log('failed.....', err)
                })
            }
            req.body.student_photo = req.file.filename;
        }

        let data = await studentModel.findByIdAndUpdate(req.params._id, req.body, { new: true });
        if (!data) res.status(404).json({ message: "Student Data Not found" });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});


//delete data API

router.delete('/:_id', async (req, res) => {
    try {
        let data = await studentModel.findByIdAndDelete(req.params._id);
        if (!data) res.status(404).json({ message: "Student Data Not found" });
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// search data api
router.get('/search/:key', async (req, res) => {

    try {
        const key = req.params.key;
        const searchCon = [
            { student_name: { $regex: key, $options: 'i' } },
            { student_email: { $regex: key, $options: 'i' } }
        ]
        if (!isNaN(key)) {
            searchCon.push({ $or: [{ student_age: Number(key) }, { _id: Number(key) }] })
        }
        let data = await studentModel.find({
            $or: searchCon
        })
        if (data.length === 0) {
            return res.status(404).json({ message: "student not found" })
        }
        res.json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


export default router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTg2ZDczMWMxNGE1ZjcwNWE1OTI5YTkiLCJ1c2VybmFtZSI6Ik5pc2hhIiwiaWF0IjoxNzcwNDQ0Njg4LCJleHAiOjE3NzA1MzEwODh9.M6pkJ9MGr3SDtn2-28DZXpWhgOIKCCUSwgD_Mwd_wcE