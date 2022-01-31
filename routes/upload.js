import express from "express";
// import { isAuthenticated } from "../controller/auth.js";
import multer from 'multer';

const PATH = 'C:\\Users\\Mi\\OneDrive\\Documents\\Relevel\\FullStack\\Whatsapp\\WhatsappClone\\uploads'

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
 });
 
 const upload = multer({ storage: storage });

const router = express.Router();

router.post('/upload', upload.single('image'), (req, res) => {
    try {
    const image = req.file.filename;
    res.json({ status: true, message: 'File uploaded successfully.', image: `${PATH}\\${image}`});
    return;
    }
    catch (error) {
        console.log(error);
        res.json({ status: false, message: 'Failed to uploaded file' });
        return;
    }
})

export { router as uploadRouter };