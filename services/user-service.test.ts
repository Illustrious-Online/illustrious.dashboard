import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "./user-service";

global.fetch = vi.fn() as unknown as typeof fetch;

describe("UserService", () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user and return user details", async () => {
      const mockUser = { id: "1", email: "test@example.com" };
      const mockResponse = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await userService.createUser(mockUser);

      expect(fetch).toHaveBeenCalledWith(`${userService.apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUser),
      });
      expect(result).toEqual(mockResponse);
    });

    it("should return null if the API call fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);

      const result = await userService.createUser({
        id: "1",
        email: "test@example.com",
      });

      expect(result).toBeNull();
    });
  });

  describe("getUser", () => {
    it("should fetch a user by ID and return user details", async () => {
      const mockResponse = {
        id: "1",
        email: "test@example.com",
        firstName: "Test",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await userService.getUser("1");

      expect(fetch).toHaveBeenCalledWith(`${userService.apiUrl}/users/1`);
      expect(result).toEqual(mockResponse);
    });

    it("should return null if the user is not found (404)", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      const result = await userService.getUser("1");

      expect(result).toBeNull();
    });

    it("should return null if the API call fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);

      const result = await userService.getUser("1");

      expect(result).toBeNull();
    });
  });

  describe("updateUser", () => {
    it("should update a user and return updated user details", async () => {
      const mockUserData = { firstName: "Updated" };
      const mockResponse = {
        id: "1",
        email: "test@example.com",
        firstName: "Updated",
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await userService.updateUser("1", mockUserData);

      expect(fetch).toHaveBeenCalledWith(`${userService.apiUrl}/users/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mockUserData),
      });
      expect(result).toEqual(mockResponse);
    });

    it("should return null if the API call fails", async () => {
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false } as Response);

      const result = await userService.updateUser("1", {
        firstName: "Updated",
      });

      expect(result).toBeNull();
    });
  });
});
