import { Document } from 'mongoose';

type RoomType = 'standard' | 'deluxe' | 'suite' | 'executive_suite' | 'family_room';

interface IRoom extends Document {
  _id?: string;
  room_number: string;
  room_type: RoomType;
  capacity: number;
  price_per_night: number;
  description: string;
  is_booked: boolean;
  deleted?: boolean;
}

export default IRoom;
