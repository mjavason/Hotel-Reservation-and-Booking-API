import { z } from 'zod';

class ReservationValidation {
  // Validation schema for creating a new reservation
  create = {
    body: z.object({
      room_number: z.string(),
      seating_plan_section: z.string(),
      status: z.enum(['valid', 'invalid', 'used']),
    }),
  };

  // Validation schema for updating an existing reservation
  update = {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      room_number: z.string().optional(),
      user: z.string().optional(),
      seating_plan_section: z.string().optional(),
      status: z.enum(['valid', 'invalid', 'used']).optional(),
    }),
  };

  // Validation schema for deleting a reservation
  delete = {
    params: z.object({
      id: z.string(),
    }),
  };

  // Validation schema for retrieving reservations with specific criteria
  find = {
    query: z.object({
      _id: z.string().optional(),
      room_number: z.string().optional(),
      user: z.string().optional(),
      seating_plan_section: z.string().optional(),
      reservation_number: z.string().optional(),
      status: z.enum(['valid', 'invalid', 'used']).optional(),
    }),
  };
}

export const reservationValidation = new ReservationValidation();
