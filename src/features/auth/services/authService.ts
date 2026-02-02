import api from '@/lib/api'
import publicApi from '@/lib/publicApi'
import { ResponseApi } from '@/lib/api.type'
import Cookies from 'js-cookie'
import { parseData } from '@/utils/parseDate'
import { LoginResponse, UserDetail } from '../types/auth'

export const loginApi = async (email: string, password: string) => {
  try {
    const data = { email, password }
    const res = await publicApi.post("/api/login", data)

    const response = res.data as ResponseApi<LoginResponse>
    const loginData = response.data

    Cookies.set('accessToken', response.data.accessToken)
    Cookies.set('refreshToken', response.data.refreshToken)
    Cookies.set('expiryTime', response.data.expiryTime)

    return loginData
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

type RawUserDetail = Omit<UserDetail, 'role'> & {
  role: Omit<UserDetail['role'], 'privileges'> & { privileges: string };
};

export const getMe = async (): Promise<UserDetail> => {
  try {
    const res = await api.get("/api/auth/detail");
    const response = res.data as ResponseApi<RawUserDetail>;

    return {
      ...response.data,
      role: {
        ...response.data.role,
        privileges: parseData(response.data.role.privileges)
      },
    };
  } catch (err) {
    throw err;
  }
}