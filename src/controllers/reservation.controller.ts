import { Request, Response } from 'express';
import { roomService, reservationService, userService } from '../services';
import {
  SuccessResponse,
  InternalErrorResponse,
  NotFoundResponse,
  ForbiddenResponse,
} from '../helpers/response';
import { MESSAGES } from '../constants';
import logger from '../helpers/logger';
import { mailController } from './mail.controller';

async function generateUniqueReservationNumber() {
  while (true) {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number

    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    const numberStr = 'T' + number.toString();

    const existingAccount = await reservationService.findOne({ reservation_number: numberStr });

    if (!existingAccount) return numberStr;
  }
}

class Controller {
  async create(req: Request, res: Response) {
    let reservationCost = 0;

    req.body.user = res.locals.user._id;
    req.body.reservation_number = await generateUniqueReservationNumber();

    // Find the room based on the provided room ID
    const room = await roomService.findOne({ _id: req.body.room });

    if (!room) return NotFoundResponse(res, 'Room not found');

    // Iterate through the seating plans of the room to find the reservation cost and check capacity
    // for (const seating_plan of room.seating_plan) {
    //   if (seating_plan.section === req.body.seating_plan_section) {
    //     if (seating_plan.capacity > 0) {
    //       // Seat is available, update reservation cost and selected seating plan
    //       reservationCost = seating_plan.price;
    //       seating_plan.capacity - 1; //deduct capacity when seating plan is found
    //       break; // Exit the loop when the matching seating plan is found
    //     } else {
    //       // Seat is not available, return an appropriate response
    //       return NotFoundResponse(res, 'Seating plan is at full capacity');
    //     }
    //   }
    // }

    // If selectedSeatingPlan is still null, it means the seating plan was not found
    if (reservationCost === 0) return NotFoundResponse(res, 'Seating plan not found');

    // Find the organizer of the room
    const organizer = await userService.findOne({ _id: room });

    if (!organizer) return NotFoundResponse(res, 'Organiser not found');

    // Update the organizer's account balance with the reservation cost
    const updatedUser = await userService.update(
      { _id: organizer },
      { $inc: { account_balance: reservationCost } },
    );

    if (!updatedUser) return InternalErrorResponse(res, 'Unable to update organizer account');

    // Create the reservation based on the provided request data
    const data = await reservationService.create(req.body);

    // If reservation creation fails, return an "Internal Server Error" response
    if (!data) return InternalErrorResponse(res);

    // // Update the seating plan capacity after successful reservation creation
    // await roomService.update(
    //   { _id: req.body.room, 'seating_plan.section': req.body.seating_plan_section },
    //   { $inc: { 'seating_plan.$.capacity': -1 } },
    // );

    //save room capacity decrease
    await room.save();

    // Return a "Success" response with the created reservation data
    return SuccessResponse(res, data);
  }

  async getAll(req: Request, res: Response) {
    let pagination = parseInt(req.params.pagination);

    if (!pagination) pagination = 1;

    pagination = (pagination - 1) * 10;

    const data = await reservationService.getAll(pagination);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async getCount(req: Request, res: Response) {
    const data = await reservationService.getCount(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: 0 });

    return SuccessResponse(res, data);
  }

  async exists(req: Request, res: Response) {
    const data = await reservationService.exists(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: false });

    return SuccessResponse(res, data);
  }

  async find(req: Request, res: Response) {
    const data = await reservationService.find(req.query);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = await reservationService.update({ _id: id }, req.body);

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.UPDATED);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await reservationService.softDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  // Admins only
  async hardDelete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await reservationService.hardDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }
}

export const reservationController = new Controller();
