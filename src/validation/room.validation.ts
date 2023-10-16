import { z } from 'zod';

//tuple
const RoomTypeValues = ['standard', 'deluxe', 'suite', 'executive_suite', 'family_room'] as const;

class RoomValidation {
  // Validation schema for creating a new room
  create = {
    body: z.object({
      room_number: z.string(),
      room_type: z.enum(RoomTypeValues),
      capacity: z.number(),
      price_per_night: z.number(),
      description: z.string(),
    }),
  };

  // Validation schema for updating an existing room
  update = {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      room_number: z.string().optional(),
      room_type: z.enum(RoomTypeValues).optional(),
      capacity: z.number().optional(),
      price_per_night: z.number().optional(),
      description: z.string().optional(),
      is_booked: z.boolean().optional(),
    }),
  };

  // Validation schema for deleting a room
  delete = {
    params: z.object({
      id: z.string(),
    }),
  };

  // Validation schema for retrieving rooms with specific criteria
  find = {
    query: z.object({
      _id: z.string().optional(),
      room_number: z.string().optional(),
      room_type: z.enum(RoomTypeValues).optional(),
      capacity: z.string().optional(),
      price_per_night: z.string().optional(),
      description: z.string().optional(),
      is_booked: z.string().optional(),
    }),
  };
}

export const roomValidation = new RoomValidation();
