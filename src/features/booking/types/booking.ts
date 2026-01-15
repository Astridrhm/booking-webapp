import { Room } from "@/features/room/types/room";
import { UserRes } from "@/features/users/types/user";

export enum BookingStatus {
  requested = 'REQUESTED',
  approved = 'APPROVED',
  rejected = 'REJECTED',
  canceled = 'CANCELED',
}

export interface Booking {
  id: string;
  roomId: string;
  title: string;
  category: string;
  subCategory: string;
  description: string;
  startDate: string;
  endDate: string;
  userId: string;
  status: string;
  pic: string;
  detailContact: string;
  subCategoryId: string;
  room: Room;
  user: UserRes;
}

export interface BookingCalendar{
  id: string
  startDate: string
  endDate: string
  title: string
  roomId: string
  // rowNumber: string
  // totalCount: string
}

// request
export type FilterData = {
  room: {
    value: string,
    label: string,
    locId: string
  }
  startDate?: Date
  endDate?: Date
  status?: string
}

export interface BookingRequest {
  bookingId?: string,
  roomId?: string,
  userId?: string,
  title?: string,
  description?: string,
  detail?: string,
  startDate?: string,
  endDate?: string,
  pic?: string | null,
  detailContact?: string | null
  category?: string
  subCategoryId?: string
}