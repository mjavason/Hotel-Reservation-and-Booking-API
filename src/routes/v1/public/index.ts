import express, { Request, Response } from 'express';
const router = express.Router();
import authRoute from './auth.route';

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Get a hello message
 *     tags:
 *       - Reservations
 *     parameters:
 *       - in: body
 *         name: id
 *         required: true
 *         schema:
 *           type: object
 *           example:
 *             {
 *               "name": "IRobot",
 *               "creator": null,
 *               "deleted": false,
 *               "_id": "651da106a4e6fe207700297b",
 *               "memories": [],
 *               "createdAt": "2023-10-04T17:29:42.884Z",
 *               "updatedAt": "2023-10-04T17:29:42.884Z",
 *               "__v": 0
 *             }
 *     responses:
 *       200:
 *         description: A JSON object with a hello message
 *         content:
 *           application/json:
 *             example: { message: "Hello, Swagger!" }
 *       404:
 *         description: A JSON object with a hello message
 *         content:
 *           application/json:
 *             example: { message: "Hello, Swagger!" }
 */
router.get('/hello', (req: Request, res: Response) => {
  console.log(req.body, 'body');
  console.log(req.query, 'query');
  console.log(req.params, 'params');
  res.json({ message: 'Hello, Swagger!' });
});

router.use('/auth', authRoute);

export default router;
