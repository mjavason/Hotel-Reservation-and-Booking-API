import { z } from 'zod';
import { Types } from 'mongoose';

class ReservationValidation {
  // Validation schema for creating a new reservation
  create = {
    body: z.object({
      room: z.string().refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId format',
      }),
      seating_plan_section: z.string(),
      status: z.enum(['valid', 'invalid', 'used']),
    }),
  };

  // Validation schema for updating an existing reservation
  update = {
    params: z.object({
      id: z.string().refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId format',
      }),
    }),
    body: z.object({
      room: z
        .string()
        .refine((value) => Types.ObjectId.isValid(value), {
          message: 'Invalid ObjectId format',
        })
        .optional(),
      user: z
        .string()
        .refine((value) => Types.ObjectId.isValid(value), {
          message: 'Invalid ObjectId format',
        })
        .optional(),
      seating_plan_section: z.string().optional(),
      status: z.enum(['valid', 'invalid', 'used']).optional(),
    }),
  };

  // Validation schema for deleting a reservation
  delete = {
    params: z.object({
      id: z.string().refine((value) => Types.ObjectId.isValid(value), {
        message: 'Invalid ObjectId format',
      }),
    }),
  };

  // Validation schema for retrieving reservations with specific criteria
  find = {
    query: z.object({
      _id: z
        .string()
        .refine((value) => Types.ObjectId.isValid(value), {
          message: 'Invalid ObjectId format',
        })
        .optional(),
      room: z
        .string()
        .refine((value) => Types.ObjectId.isValid(value), {
          message: 'Invalid ObjectId format',
        })
        .optional(),
      user: z
        .string()
        .refine((value) => Types.ObjectId.isValid(value), {
          message: 'Invalid ObjectId format',
        })
        .optional(),
      seating_plan_section: z.string().optional(),
      reservation_number: z.string().optional(),
      status: z.enum(['valid', 'invalid', 'used']).optional(),
    }),
  };
}

export const reservationValidation = new ReservationValidation();
