import {
  mockUsersResponse,
  mockUserUpdateResponse,
  mockUserAddResponse,
  mockUserDeletionResponse,
  mockUpdateProfileResponse,
} from '@/data/mock-response'
import { apiService } from './api.service'
import {
  UserListResponse,
  UserListRequest,
  UserAddOrUpdateResponse,
  UserDeletionResponse,
  UpdateProfileResponse,
} from '@/models/user.model'
import {
  ProfileUpdateRequest,
  UserAddOrUpdateRequest,
} from '@/validations/user.validation'

class UserService {
  private api: typeof apiService
  controller: string = 'users'

  constructor() {
    this.api = apiService
  }

  async getAllUsers(body: UserListRequest) {
    return new Promise<UserListResponse>((resolve) => {
      setTimeout(() => {
        resolve(mockUsersResponse(body) as UserListResponse)
      }, 2000)
    })
    return this.api.get<UserListResponse>(
      `${this.controller}/all?page=${body.pagination.pageIndex}&perPage=${body.pagination.pageSize}`
    )
  }

  async addUser(user: UserAddOrUpdateRequest) {
    return new Promise<UserAddOrUpdateResponse>((resolve) => {
      setTimeout(() => {
        resolve(mockUserAddResponse(user) as UserAddOrUpdateResponse)
      }, 500)
    })
    // Uncomment this to make the actual API call
    // return this.api.post<UserAddOrUpdateResponse>(`${this.controller}/add`, user)
  }

  async updateUser(id: number, user: UserAddOrUpdateRequest) {
    return new Promise<UserAddOrUpdateResponse>((resolve) => {
      setTimeout(() => {
        resolve(mockUserUpdateResponse(id, user) as UserAddOrUpdateResponse)
      }, 500)
    })
    // Uncomment this to make the actual API call
    // return this.api.put<UserAddOrUpdateResponse>(`${this.controller}/update/${id}`, user)
  }

  async deleteUser(id: number) {
    return new Promise<UserDeletionResponse>((resolve) => {
      setTimeout(() => {
        resolve(mockUserDeletionResponse(id) as UserDeletionResponse)
      }, 500)
    })
    // Uncomment this to make the actual API call
    // return this.api.delete<UserDeletionResponse>(`${this.controller}/${id}`)
  }

  async updateProfile(body: ProfileUpdateRequest) {
    return new Promise<UpdateProfileResponse>((resolve) => {
      setTimeout(() => {
        resolve(mockUpdateProfileResponse(body) as UpdateProfileResponse)
      }, 500)
    })
    // Uncomment this to make the actual API call
    // return this.api.put<ProfileUpdateResponse>(`${this.controller}/profile`, body);
  }
}

export const userService = new UserService()
