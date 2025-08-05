import { Role } from "@/features/role/types/role";
import { UserRes } from "@/features/users/types/user";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "user" | string;
}

export interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiryTime: string;
}

export interface UserDetail {
  user: UserRes,
  role: Role
}
