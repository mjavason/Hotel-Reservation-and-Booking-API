import { Request, Response } from 'express';
import { eventService, ticketService, userService } from '../services';
import {
  SuccessResponse,
  InternalErrorResponse,
  NotFoundResponse,
  ForbiddenResponse,
} from '../helpers/response';
import { MESSAGES } from '../constants';
import logger from '../helpers/logger';
import { mailController } from './mail.controller';

async function generateUniqueTicketNumber() {
  while (true) {
    const min = 1000000000; // Minimum 10-digit number
    const max = 9999999999; // Maximum 10-digit number

    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    const numberStr = 'T' + number.toString();

    const existingAccount = await ticketService.findOne({ ticket_number: numberStr });

    if (!existingAccount) return numberStr;
  }
}

class Controller {
  async create(req: Request, res: Response) {
    let ticketCost = 0;

    req.body.user = res.locals.user._id;
    req.body.ticket_number = await generateUniqueTicketNumber();

    // Find the event based on the provided event ID
    const event = await eventService.findOne({ _id: req.body.event });

    if (!event) return NotFoundResponse(res, 'Event not found');

    // Iterate through the seating plans of the event to find the ticket cost and check capacity
    for (const seating_plan of event.seating_plan) {
      if (seating_plan.section === req.body.seating_plan_section) {
        if (seating_plan.capacity > 0) {
          // Seat is available, update ticket cost and selected seating plan
          ticketCost = seating_plan.price;
          seating_plan.capacity - 1; //deduct capacity when seating plan is found
          break; // Exit the loop when the matching seating plan is found
        } else {
          // Seat is not available, return an appropriate response
          return NotFoundResponse(res, 'Seating plan is at full capacity');
        }
      }
    }

    // If selectedSeatingPlan is still null, it means the seating plan was not found
    if (ticketCost === 0) return NotFoundResponse(res, 'Seating plan not found');

    // Find the organizer of the event
    const organizer = await userService.findOne({ _id: event.organizer });

    if (!organizer) return NotFoundResponse(res, 'Organiser not found');

    // Update the organizer's account balance with the ticket cost
    const updatedUser = await userService.update(
      { _id: organizer },
      { $inc: { account_balance: ticketCost } },
    );

    if (!updatedUser) return InternalErrorResponse(res, 'Unable to update organizer account');

    // Create the ticket based on the provided request data
    const data = await ticketService.create(req.body);

    // If ticket creation fails, return an "Internal Server Error" response
    if (!data) return InternalErrorResponse(res);

    // // Update the seating plan capacity after successful ticket creation
    // await eventService.update(
    //   { _id: req.body.event, 'seating_plan.section': req.body.seating_plan_section },
    //   { $inc: { 'seating_plan.$.capacity': -1 } },
    // );

    //save event capacity decrease
    await event.save();

    // Return a "Success" response with the created ticket data
    return SuccessResponse(res, data);
  }

  async getAll(req: Request, res: Response) {
    let pagination = parseInt(req.params.pagination);

    if (!pagination) pagination = 1;

    pagination = (pagination - 1) * 10;

    const data = await ticketService.getAll(pagination);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async getCount(req: Request, res: Response) {
    const data = await ticketService.getCount(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: 0 });

    return SuccessResponse(res, data);
  }

  async exists(req: Request, res: Response) {
    const data = await ticketService.exists(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: false });

    return SuccessResponse(res, data);
  }

  async find(req: Request, res: Response) {
    const data = await ticketService.find(req.query);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = await ticketService.update({ _id: id }, req.body);

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.UPDATED);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await ticketService.softDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  // Admins only
  async hardDelete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await ticketService.hardDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }
}

export const reservationController = new Controller();
