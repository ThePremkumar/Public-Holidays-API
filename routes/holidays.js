import express from 'express';
import { getHolidays } from '../controllers/holidayController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/:year', auth, getHolidays);

export default router;
