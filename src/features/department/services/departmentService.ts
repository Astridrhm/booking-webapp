import publicApi from "@/lib/publicApi"
import { Department, DepartmentReq } from "../types/department"
import { FilterQuery, Pagination, ResponseApi } from "@/lib/api.type"
import api from "@/lib/api"

export const getDepartment = async (): Promise<Department[]> => {
  const res = await listDepartment({})
  return res.list
}

export const listDepartment  = async ({page, limit, filter = {}}: FilterQuery): Promise<Pagination<Department[]>> => {
  try {
    const res = await publicApi.get("/api/departments", {
      params: {
        filter: JSON.stringify(filter),
        page: page,
        limit: limit,
      },
    })
    
    const response = res.data as ResponseApi<Pagination<Department[]>>
    const room = response.data
    return room
  
  } catch (error: any) {
    console.error("Failed to fetch room list:", error)
    throw new Error(error?.message || "Unknown error occurred while fetching room list")
  }
}

export const createDepartment = async (data: DepartmentReq) => {
  try {  
    const res = await api.post("/api/departments", data)
    return res.data
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while crate user")
  }
}

export const updateDepartment = async (data: DepartmentReq) => {
  try {  
    const res = await api.patch("/api/departments", data)
    return res.data
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while crate user")
  }
}