import publicApi from "@/lib/publicApi"
import { Locations, Room, RoomReq, RoomRes } from "../types/room"
import { FilterQuery, Pagination, ResponseApi } from "@/lib/api.type"
import api from "@/lib/api"

export const getLocation = async () => {
  try {  
    const res = await publicApi.get("/api/locations")

    const response = res.data as ResponseApi<Pagination<Locations[]>>
    const location = response.data

    const list = location.list

    if (!list) {
      return []
    }

    console.log("ini list", list)
    return list

  
  } catch (error: any) {
    console.error("Failed to fetch location list:", error)
    throw new Error(error?.message || "Unknown error occurred while fetching location list")
  }
}

export const listRoom  = async ({page, limit, filter = {}}: FilterQuery): Promise<Pagination<Room[]>> => {
  try {
    const res = await publicApi.get("/api/rooms", {
      params: {
        filter: JSON.stringify(filter),
        page: page,
        limit: limit,
      },
    })
    
    const response = res.data as ResponseApi<Pagination<Room[]>>
    const room = response.data
    return room
  
  } catch (error: any) {
    console.error("Failed to fetch room list:", error)
    throw new Error(error?.message || "Unknown error occurred while fetching room list")
  }
}

export const createRoom = async (data: RoomReq) => {
  try {  
    const res = await api.post("/api/rooms", data)
    return res.data
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while crate user")
  }
}

export const updateRoom = async (data: RoomReq) => {
  try {  
    const res = await api.patch("/api/rooms", data)
    return res.data
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while crate user")
  }
}

export const getRoomById = async (roomId: string): Promise<RoomRes> => {
  try {
    const res = await api.get(`/api/rooms/${roomId}`)
    const respone = res.data as ResponseApi<ResponseApi<RoomRes>>
    return respone.data.data
  
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while fetching users list")
  }
}
