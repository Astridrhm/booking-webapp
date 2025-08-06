export enum RoleID {
  superAdmin = 'superadmin',
  user = 'user',
  admin = 'admin',
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