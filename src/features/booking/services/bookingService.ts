import api from '@/lib/api'
import { Booking, CreateBookingRequest } from '../types/booking'
import { FilterQuery, Pagination, ResponseApi } from '@/lib/api.type'

export const listBooking = async ({page, limit, orderDir, orderBy, filter = {}}: FilterQuery): Promise<Pagination<Booking[]>> => {
  try {
    const res = await api.get("/api/bookings", {
      params: {
        filter: JSON.stringify(filter),
        page: page,
        limit: limit,
        orderDir: orderDir,
        orderBy: orderBy
      },
    })

    const response = res.data as ResponseApi<Pagination<Booking[]>>
    const booking = response.data
    
    return booking
  
  } catch (error: any) {
    console.error("Failed to fetch booking list:", error)
    throw new Error(error?.message || "Unknown error occurred while fetching booking list")
  }
}

export const createBooking = async (data: CreateBookingRequest) => {
  try {  
    const res = await api.post("/api/bookings", data)
    console.log("Data", res)
    return res.data

  
  } catch (error: any) {
    console.error("Failed to booking:", error)
    throw new Error(error?.message || "Unknown error occurred while booking room")
  }
}

export const approvalBooking = async (bookingId: string, status: string) => {
  try {  
    const res = await api.post("/api/bookings/approval", {bookingId, status})
    console.log("Data", res)
    return res.data
  
  } catch (error: any) {
    console.error("Failed to booking:", error)
    throw new Error(error?.message || "Unknown error occurred while booking room")
  }
}

export const getBooking = async (bookingId: string): Promise<Booking> => {
  try {
    const res = await api.get(`/api/bookings/${bookingId}`)
    const response = res.data as ResponseApi<ResponseApi<Booking>>
    return response.data.data
  
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while fetching booking data")
  }
}

export const updateBooking = async (data: CreateBookingRequest) => {
  try {  
    const res = await api.patch("/api/bookings", data)
    console.log("Data", res)
    return res.data
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while crate user")
  }
}