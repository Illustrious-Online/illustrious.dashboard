import type { UserDetails } from '@/types/auth'

export class UserService {
  private apiUrl: string

  constructor() {
    this.apiUrl = process.env.ELYSIA_API_URL || 'http://localhost:8000'
  }

  async createUser(userData: {
    id: string,
    email: string,
    firstName?: string,
    lastName?: string,
    avatarUrl?: string
  }): Promise<UserDetails | null> {
    try {
      const response = await fetch(`${this.apiUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create user')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  async getUserById(userId: string): Promise<UserDetails | null> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        throw new Error('Failed to fetch user')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async updateUser(userId: string, userData: Partial<UserDetails>): Promise<UserDetails | null> {
    try {
      const response = await fetch(`${this.apiUrl}/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update user')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }
}