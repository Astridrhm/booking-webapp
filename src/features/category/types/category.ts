export interface Category {
  id: string,
  name: string,
  createdAt: Date,
  updatedAt: Date
}

export interface SubCategory {
  id: string
  name: string
  categoryId: string
  createdAt: string
  updatedAt: string
  category: string
}