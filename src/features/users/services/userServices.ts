import api from "@/lib/api"
import {  UserRes, UserReq } from "../types/user"
import { FilterQuery, Pagination, ResponseApi } from "@/lib/api.type"

export const createUser = async (data: UserReq) => {
  try {  
    const res = await api.post("/api/users", data)
    return res.data
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while crate user")
  }
}

export const updateUser = async (data: UserReq) => {
  try {  
    const res = await api.patch("/api/users", data)
    return res.data
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while crate user")
  }
}

export const listUser = async ({page, limit, filter = {}}: FilterQuery): Promise<Pagination<UserRes[]>> => {
  try {
    const res = await api.get("/api/users", {
      params: {
        filter: JSON.stringify(filter),
        page: page,
        limit: limit,
      },
    })
    
    const response = res.data as ResponseApi<Pagination<UserRes[]>>
    const user = response.data
    return user
  
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while fetching users list")
  }
}

export const activateUser = async (userId: string) => {
  try {
    const res = await api.post("/api/users/activate", {userId})
    const respone = res.data as ResponseApi
    return respone
  
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while fetching users list")
  }
}

export const deactiveUser = async (userId: string) => {
  try {
    const res = await api.request({
      url: "/api/users",
      method: "DELETE",
      data: { userId }
    })
    const respone = res.data as unknown as ResponseApi
    return respone
  
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while fetching users list")
  }
}

export const getUserById = async (userId: string): Promise<UserRes> => {
  try {
    const res = await api.get(`/api/users/${userId}`)
    const respone = res.data as ResponseApi<UserRes>
    return respone.data
  
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while fetching users list")
  }
}