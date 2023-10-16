import { Schema, model, Document, Model } from 'mongoose';
import IRoom from '../interfaces/room.interface';
import { DATABASES } from '../constants';

const RoomSchema: Schema<IRoom> = new Schema(
  {
    room_number: { type: String, required: true },
    room_type: { type: String, required: true },
    capacity: { type: Number, required: true },
    price_per_night: { type: Number, required: true },
    description: { type: String, required: true },
    is_booked: { type: Boolean, required: true },
    deleted: { type: Boolean, select: false, default: false },
  },
  { timestamps: true },
);

const RoomModel = model<IRoom>(DATABASES.ROOM, RoomSchema);
export default RoomModel;
