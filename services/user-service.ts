import type { UserDetails } from "@/types/auth";

export class UserService {
  public apiUrl: string;

  constructor() {
    this.apiUrl = process.env.ELYSIA_API_URL || "http://localhost:8000";
  }

  async createUser(userData: {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  }): Promise<UserDetails | null> {
    try {
      const response = await fetch(`${this.apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  async getUser(value: string, by?: string): Promise<UserDetails | null> {
    try {
      const url = by
        ? `${this.apiUrl}/user/${value}?by=${by}`
        : `${this.apiUrl}/user/${value}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch user");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<UserDetails>,
  ): Promise<UserDetails | null> {
    const response = await fetch(`${this.apiUrl}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return await response.json();
  }
}
