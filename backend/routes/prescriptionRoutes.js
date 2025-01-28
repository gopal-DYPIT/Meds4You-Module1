import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { uploadPrescription } from '../controllers/prescriptionController.js';

const router = express.Router();

router.post('/upload', upload.single('prescription'), uploadPrescription);

export default router;
