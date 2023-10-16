import express from 'express';
const router = express.Router();
import roomRouter from './rooms.route';
import reservationRouter from './reservation.route';
import isAuth from '../../../middleware/is_auth.middleware';

router.use(isAuth);
router.use('/room', roomRouter);
router.use('/router', reservationRouter);
router.use('/reservation', reservationRouter);
export default router;
