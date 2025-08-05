export enum RoleID {
  superAdmin = '5e1c5763-09de-4e64-a350-6f34c934214e',
  user = '38609e65-6388-470e-a685-47647e0add5c',
  admin = '955c6c37-ce43-403c-896f-c7b61ab53aa1',
}

export type Role = {
  id: string,
  name: string,
  privileges: Privilege[] | "*"
}

export type Privilege = {
  resource: string;
  scopes: string[];
};