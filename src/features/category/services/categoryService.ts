import { Pagination, ResponseApi } from "@/lib/api.type"
import publicApi from "@/lib/publicApi"
import { Category, SubCategory } from "../types/category"

export const listCategories = async () => {
  try {  
    const res = await publicApi.get("/api/categories")

    const response = res.data as ResponseApi<Pagination<Category[]>>
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

export const listSubCategories = async (categoryId: string) => {
  try {  
    const res = await publicApi.get("/api/subcategories", {params: {categoryId}})

    const response = res.data as ResponseApi<Pagination<SubCategory[]>>
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