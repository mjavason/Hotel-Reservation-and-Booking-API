import express, { Request, Response } from 'express';
const router = express.Router();
import authRoute from './auth.route';

/**
 * @swagger
 * /api/v1/hello:
 *   post:
 *     summary: Get a hello message
 *     tags:
 *      - Reservations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *     responses:
 *       200:
 *         description: A JSON object with a hello message
 *         content:
 *           application/json:
 *             example: { message: "Hello, Swagger!" }
 */


router.get('/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello, Swagger!' });
});

router.use('/auth', authRoute);

export default router;
