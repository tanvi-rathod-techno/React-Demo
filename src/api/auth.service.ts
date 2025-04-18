import {
  ChangePasswordResponse,
  GenerateNewTokenResponse,
  LoginResponse,
  User,
} from '@/models/user.model'
import { apiService } from './api.service'
import {
  SignupRequest,
  LoginRequest,
  ChangePasswordRequest,
} from '@/validations/auth.validation'
import {
  mockChangePasswordResponse,
  mockGenerateNewTokenResponse,
  mockLoginResponse,
  mockUser,
} from '@/data/mock-response'

class AuthService {
  private api: typeof apiService
  controller: string = 'auth'

  constructor() {
    this.api = apiService
  }

  async login(body: LoginRequest) {
    return Promise.resolve(mockLoginResponse as LoginResponse)
    return this.api.post<LoginResponse>(`${this.controller}/login`, body)
  }

  async signup(body: SignupRequest) {
    return Promise.resolve(mockLoginResponse as LoginResponse)
    return this.api.post<LoginResponse>(`${this.controller}/signup`, body)
  }

  async getAccessToken(refreshToken: string | null = null) {
    return Promise.resolve(
      mockGenerateNewTokenResponse as GenerateNewTokenResponse
    )
    return this.api.post<GenerateNewTokenResponse>(
      `${this.controller}/access-token`,
      refreshToken ? { refreshToken } : undefined
    )
  }

  async getUserInfo(): Promise<User> {
    return Promise.resolve(mockUser as User)
    return this.api.get<User>(`${this.controller}/me`)
  }

  async changePassword(body: ChangePasswordRequest) {
    return Promise.resolve(mockChangePasswordResponse as ChangePasswordResponse)
    return this.api.post<ChangePasswordResponse>(
      `${this.controller}/change-password`,
      body
    )
  }
}

export const authService = new AuthService()
