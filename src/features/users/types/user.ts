import { Role } from '@/features/role/types/role'

export interface User {
  id: string,
  email: string,
  name: string,
  password: string,
  departmentId: string,
  createdAt: Date,
  updatedAt: Date,
  isActive: boolean
}

export type FilterData = {
  name: string
}

export type UserReq = {
  userId?: string,
  email?: string,
  name?: string,
  contact?: string,
  password?: string,
  roleId?: string
  departmentId?: string
}

export type UserRes = {
  id: string,
  createdAt: string,
  email:string,
  name: string,
  role: Role,
  isActive: boolean,
  departmentid: string,
  contact?: any,
  deparment: {
    id: string,
    name: string
  }
}