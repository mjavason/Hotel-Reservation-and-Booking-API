import { Router } from 'express';
const router = Router();
import {
  processRequestBody,
  processRequestParams,
  processRequestQuery,
} from 'zod-express-middleware';
import { reservationController } from '../../../controllers';
import { reservationValidation } from '../../../validation';

router.get(
  '/search',
  processRequestQuery(reservationValidation.find.query),
  reservationController.find,
);

router.get(
  '/count',
  processRequestQuery(reservationValidation.find.query),
  reservationController.getCount,
);

router.get(
  '/exists',
  processRequestQuery(reservationValidation.find.query),
  reservationController.exists,
);

router.get('/', reservationController.getAll);

router.get('/:pagination', reservationController.getAll);

router.post(
  '/',
  processRequestBody(reservationValidation.create.body),
  reservationController.create,
);

router.patch(
  '/:id',
  processRequestBody(reservationValidation.update.body),
  reservationController.update,
);

router.delete(
  '/:id',
  processRequestParams(reservationValidation.delete.params),
  reservationController.delete,
);

export default router;
