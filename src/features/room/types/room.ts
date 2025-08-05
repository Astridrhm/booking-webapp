export interface Locations {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
  locationId: string;
  floor: string;
  capacity: string;
  createdAt: string;
  updatedAt: string;
  location: Locations;
}

export type FilterData = {
  name: string;
}

export type RoomReq = {
  roomId?: string;
  name?: string;
  locationId?: string;
  floor?: string;
  capacity?: string;
}

export type RoomRes = {
  id: string;
  name: string;
  locationId: string;
  floor: string;
  capacity: string;
  createdat: string;
  updatedat: string;
  location: Locations;
}