import express from 'express';
import accounts from '../controllers/accountsController.js';

const router = express.Router();

router.get('/balance', accounts.balance);
router.get('/average', accounts.average);
router.get('/lowest', accounts.lowest);
router.get('/highest', accounts.highest);

router.post('/deposit', accounts.deposit);
router.post('/withdraw', accounts.withdraw);
router.post('/transfer', accounts.transfer);
router.post('/moveToPrivate', accounts.moveToPrivate);

router.delete('/remove', accounts.remove);

export default router;
