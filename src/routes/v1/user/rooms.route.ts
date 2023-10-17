import { Router } from 'express';
const router = Router();
import {
  processRequestBody,
  processRequestParams,
  processRequestQuery,
} from 'zod-express-middleware';
import { roomController } from '../../../controllers';
import { roomValidation } from '../../../validation';

router.get('/search', processRequestQuery(roomValidation.find.query), roomController.find);

router.get('/count', processRequestQuery(roomValidation.find.query), roomController.getCount);

router.get('/exists', processRequestQuery(roomValidation.find.query), roomController.exists);

router.get('/', roomController.getAll);

router.get('/:pagination', roomController.getAll);

router.post('/', processRequestBody(roomValidation.create.body), roomController.create);


router.patch('/:id', processRequestBody(roomValidation.update.body), roomController.update);

/**
 * @swagger
 * /api/rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     description: Delete a room based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the room to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the room.
 *       400:
 *         description: Bad request.
 *     tags:
 *       - Rooms
 */
router.delete('/:id', processRequestParams(roomValidation.delete.params), roomController.delete);

export default router;
