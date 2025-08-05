export interface Department {
  id: string;
  name: string;
  createdat: string
}

export type FilterData = {
  name: string;
}

export type DepartmentReq = {
  departmentId?: string
  name?: string
}