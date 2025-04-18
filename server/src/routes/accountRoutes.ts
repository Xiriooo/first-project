// server/src/routes/accountRoutes.ts
import express from 'express';
import { getAccount } from '../controllers/accountController';

const router = express.Router();

router.get('/api/account', getAccount);

export default router;