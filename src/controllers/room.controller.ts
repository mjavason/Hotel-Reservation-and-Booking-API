import { Request, Response } from 'express';
import { roomService, reservationService, userService } from '../services';
import { SuccessResponse, InternalErrorResponse, NotFoundResponse } from '../helpers/response';
import { MESSAGES } from '../constants';
import logger from '../helpers/logger';
import { mailController } from './mail.controller';

class Controller {
  async create(req: Request, res: Response) {
    req.body.organizer = res.locals.user._id;
    const data = await roomService.create(req.body);

    if (!data) return InternalErrorResponse(res);

    return SuccessResponse(res, data);
  }

  async getAll(req: Request, res: Response) {
    let pagination = parseInt(req.params.pagination);

    if (!pagination) pagination = 1;

    pagination = (pagination - 1) * 10;

    const data = await roomService.getAll(pagination);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async exists(req: Request, res: Response) {
    const data = await roomService.exists(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: false });

    return SuccessResponse(res, data);
  }

  async getCount(req: Request, res: Response) {
    const data = await roomService.getCount(req.query);

    // If nothing exists, return 0 as the count
    if (!data) return SuccessResponse(res, { data: 0 });

    return SuccessResponse(res, data);
  }

  async find(req: Request, res: Response) {
    const data = await roomService.find(req.query);

    if (!data) return InternalErrorResponse(res);
    if (data.length === 0) return NotFoundResponse(res);

    return SuccessResponse(res, data);
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const data = await roomService.update({ _id: id }, req.body);

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.UPDATED);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await roomService.softDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  // Admins only
  async hardDelete(req: Request, res: Response) {
    const { id } = req.params;
    const data = await roomService.hardDelete({ _id: id });

    if (!data) return NotFoundResponse(res);

    return SuccessResponse(res, data, MESSAGES.DELETED);
  }

  // /**
  //  * Helper function to remind reservation holders about upcoming rooms.
  //  *
  //  * @param {number} durationBeforeRoomInHours - Time before room starts, in hours.
  //  */
  // async remindBookers(durationBeforeRoomInHours: number) {
  //   try {
  //     // Get the current time
  //     const currentTime = new Date();

  //     // Calculate the threshold time for rooms to be reminded
  //     const thresholdTime = new Date(
  //       currentTime.getTime() + durationBeforeRoomInHours * 60 * 60 * 1000,
  //     );

  //     // Find rooms that match the criteria (upcoming and active rooms)
  //     const rooms = await roomService.find({
  //       start_time: { $lte: thresholdTime },
  //       status: 'published',
  //     });

  //     // If no matching rooms are found, log and return
  //     if (!rooms || rooms.length === 0) {
  //       logger.info(`No upcoming active rooms found.`);
  //       return;
  //     }

  //     // Iterate through the found rooms
  //     for (const room of rooms) {
  //       // Find all reservations associated with the room
  //       const reservations = await reservationService.find({ room: room._id });

  //       // If no reservations are found, log and return
  //       if (!reservations || reservations.length === 0) {
  //         logger.error(`No reservations found for room: ${room.title}`);
  //         return;
  //       }

  //       for (const reservation of reservations) {
  //         // Find the user associated with the reservation
  //         const user = await userService.findOne({ _id: reservation.user });

  //         // If the user is not found, log and return
  //         if (!user) {
  //           logger.error(`User registered to reservation not found.`);
  //           return;
  //         }

  //         // Send an email reminder to the reservation holder
  //         await mailController.sendRoomReminderMail(
  //           user.email, // recipient's email address
  //           room.title, // room name
  //           room.start_time.toString(), // room date and time
  //           room.location, // room location
  //           user.first_name, // recipient's first name
  //         );

  //         logger.info(
  //           `Room: ${room.title} for ${user.first_name} ${user.last_name}, Reservation ID: ${
  //             reservation.reservation_number
  //           } reminded successfully on ${new Date()}`,
  //         );
  //       }
  //     }
  //   } catch (error: any) {
  //     // Handle any unexpected errors that may occur during the process
  //     logger.error(`Error while sending room reminders: ${error.message}`);
  //   }
  // }

  // /**
  //  * Helper function to check and mark rooms as 'done' when their end_time is passed.
  //  */
  // async setRoomsToUnbooked() {
  //   try {
  //     // Get the current time
  //     const currentTime = new Date();

  //     // Find rooms with end_time in the past
  //     const roomsToUpdate = await roomService.find({
  //       end_time: { $lte: currentTime },
  //       status: 'published', // Assuming 'active' rooms need to be marked as 'done'
  //     });

  //     // If no matching rooms are found, log and return
  //     if (!roomsToUpdate || roomsToUpdate.length === 0) {
  //       logger.info(`No rooms with end_time in the past found.`);
  //       return;
  //     }

  //     // Iterate through the found rooms and update their status to 'done'
  //     for (const room of roomsToUpdate) {
  //       room.status = 'done';
  //       await room.save();
  //       logger.info(`Room marked as 'done': ${room.title}`);
  //     }
  //   } catch (error: any) {
  //     // Handle any unexpected errors that may occur during the process
  //     logger.error(`Error while marking rooms as 'done': ${error.message}`);
  //   }
  // }
}

export const roomController = new Controller();
