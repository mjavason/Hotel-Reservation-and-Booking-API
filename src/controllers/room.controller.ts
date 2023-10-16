import { Request, Response } from 'express';
import { eventService, ticketService, userService } from '../services';
import { SuccessResponse, InternalErrorResponse, NotFoundResponse } from '../helpers/response';
import { MESSAGES } from '../constants';
import logger from '../helpers/logger';
import { mailController } from './mail.controller';

class Controller {
  async create(req: Request, res: Response) {
    req.body.organizer = res.locals.user._id;
    const data = await eventService.create(req.body);

    if (!data) return InternalErrorResponse(res);

    return SuccessResponse(res, data);
  }

  async getAll(req: Request, res: Response) {
    let pagination = parseInt(req.params.pagination);

    if (!pagination) pagination = 1;

    pagination = (pagination - 1) * 10;

    const data = await eventService.getAll(pagination);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async exists(req: Request, res: Response) {
    const data = await eventService.exists(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: false });

    return SuccessResponse(res, data);
  }

  async getCount(req: Request, res: Response) {
    const data = await eventService.getCount(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: 0 });

    return SuccessResponse(res, data);
  }

  async find(req: Request, res: Response) {
    const data = await eventService.find(req.query);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = await eventService.update({ _id: id }, req.body);

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.UPDATED);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await eventService.softDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  // Admins only
  async hardDelete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await eventService.hardDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  /**
   * Helper function to remind ticket holders about upcoming events.
   *
   * @param {number} durationBeforeEventInHours - Time before event starts, in hours.
   */
  async remindTicketHolders(durationBeforeEventInHours: number) {
    try {
      // Get the current time
      const currentTime = new Date();

      // Calculate the threshold time for events to be reminded
      const thresholdTime = new Date(
        currentTime.getTime() + durationBeforeEventInHours * 60 * 60 * 1000,
      );

      // Find events that match the criteria (upcoming and active events)
      const events = await eventService.find({
        start_time: { $lte: thresholdTime },
        status: 'published',
      });

      // If no matching events are found, log and return
      if (!events || events.length === 0) {
        logger.info(`No upcoming active events found.`);
        return;
      }

      // Iterate through the found events
      for (const event of events) {
        // Find all tickets associated with the event
        const tickets = await ticketService.find({ event: event._id });

        // If no tickets are found, log and return
        if (!tickets || tickets.length === 0) {
          logger.error(`No tickets found for event: ${event.title}`);
          return;
        }

        for (const ticket of tickets) {
          // Find the user associated with the ticket
          const user = await userService.findOne({ _id: ticket.user });

          // If the user is not found, log and return
          if (!user) {
            logger.error(`User registered to ticket not found.`);
            return;
          }

          // Send an email reminder to the ticket holder
          await mailController.sendEventReminderMail(
            user.email, // recipient's email address
            event.title, // event name
            event.start_time.toString(), // event date and time
            event.location, // event location
            user.first_name, // recipient's first name
          );

          logger.info(
            `Event: ${event.title} for ${user.first_name} ${user.last_name}, Ticket ID: ${
              ticket.ticket_number
            } reminded successfully on ${new Date()}`,
          );
        }
      }
    } catch (error: any) {
      // Handle any unexpected errors that may occur during the process
      logger.error(`Error while sending event reminders: ${error.message}`);
    }
  }

  /**
   * Helper function to check and mark events as 'done' when their end_time is passed.
   */
  async markEventsAsDone() {
    try {
      // Get the current time
      const currentTime = new Date();

      // Find events with end_time in the past
      const eventsToUpdate = await eventService.find({
        end_time: { $lte: currentTime },
        status: 'published', // Assuming 'active' events need to be marked as 'done'
      });

      // If no matching events are found, log and return
      if (!eventsToUpdate || eventsToUpdate.length === 0) {
        logger.info(`No events with end_time in the past found.`);
        return;
      }

      // Iterate through the found events and update their status to 'done'
      for (const event of eventsToUpdate) {
        event.status = 'done';
        await event.save();
        logger.info(`Event marked as 'done': ${event.title}`);
      }
    } catch (error: any) {
      // Handle any unexpected errors that may occur during the process
      logger.error(`Error while marking events as 'done': ${error.message}`);
    }
  }
}

export const roomController = new Controller();
