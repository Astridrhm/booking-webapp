import publicApi from "@/lib/publicApi"
import { Role } from "../types/role"
import { Pagination, ResponseApi } from "@/lib/api.type"

type RawRole = Omit<Role, 'privileges'> & { privileges: string };

export const getRole = async (): Promise<RawRole[]> => {
  try {  
    const res = await publicApi.get("/api/roles")
    const response = res.data as ResponseApi<Pagination<RawRole[]>>

    return response.data.list
  
  } catch (error: any) {
    throw new Error(error?.message || "Unknown error occurred while get role")
  }
}