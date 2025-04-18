import { tokenStore } from '@/store/token'

type RequestBody = undefined | Record<string, unknown> | FormData

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = import.meta.env.VITE_APP_URL || ''
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body: RequestBody = undefined,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`
    const mainHeader = new Headers(headers)
    const options: RequestInit = {
      method,
      headers: mainHeader, // Set headers initially
    }

    const token = tokenStore.getAccessToken()
    mainHeader.set('Content-Type', `application/json`)

    if (token) {
      mainHeader.set('Authorization', `Bearer ${token}`)
    }

    if (body) {
      if (body instanceof FormData) {
        options.body = body
        mainHeader.set('Content-Type', `multipart/form-data`)
      } else {
        options.body = JSON.stringify(body)
      }
    }

    try {
      options.headers = mainHeader
      const response = await fetch(url, options)
      return response.json()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('API request error:', error)
      throw error
    }
  }

  get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<T> {
    return this.request<T>(endpoint, 'GET', undefined, headers)
  }

  post<T>(
    endpoint: string,
    body: RequestBody,
    headers: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, 'POST', body, headers)
  }

  put<T>(
    endpoint: string,
    body: RequestBody,
    headers: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, 'PUT', body, headers)
  }

  delete<T>(
    endpoint: string,
    headers: Record<string, string> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, 'DELETE', undefined, headers)
  }
}

export const apiService = new ApiService()
