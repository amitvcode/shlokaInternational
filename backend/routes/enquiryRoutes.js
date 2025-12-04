import express from 'express';
import { submitEnquiry } from '../controllers/enquiryController.js';

const router = express.Router();

// POST /api/enquiry - Submit a new enquiry
router.post('/', submitEnquiry);

export default router;
