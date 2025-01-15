import type { User as IllustriousUser, Org, Report } from "@/drizzle/schema";
import type { AuthenticatedContext } from "@/plugins/auth";
import { faker } from "@faker-js/faker";
import type { Context } from "elysia";
import UnauthorizedError from "../domain/exceptions/UnauthorizedError";
import { UserRole } from "../domain/types/UserRole";
import * as orgService from "../services/org";
import * as userService from "../services/user";
import { create, deleteOne, fetchOne, update } from "./report";

const defaultContext: Context = {} as Context;
const mockUser: IllustriousUser = {
  id: faker.string.uuid(),
  identifier: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: null,
  lastName: null,
  picture: null,
  phone: null,
  superAdmin: true,
};
const secondUser: IllustriousUser = {
  id: faker.string.uuid(),
  identifier: faker.string.uuid(),
  email: faker.internet.email(),
  firstName: null,
  lastName: null,
  picture: null,
  phone: null,
  superAdmin: false,
};
const mockOrg: Org = {
  id: faker.string.uuid(),
  name: faker.company.name(),
  contact: faker.internet.email(),
};
const mockReport: Report = {
  id: faker.string.uuid(),
  createdAt: new Date(),
  rating: 5,
  notes: "Report 1 notes",
};
const mockContext = (overrides = {}) => ({
  body: {},
  user: mockUser,
  params: {},
  query: {},
  permissions: {
    superAdmin: true,
    org: { id: mockOrg.id, role: UserRole.OWNER },
  },
  ...overrides,
});

describe("Report Module", () => {
  beforeAll(async () => {
    await userService.updateOrCreate(mockUser);
    await userService.updateOrCreate(secondUser);
    await orgService.create({ user: mockUser.id, org: mockOrg });
  });

  afterAll(async () => {
    await orgService.deleteOne(mockOrg.id);
    await userService.deleteOne(mockUser.id, mockUser.identifier);
  });

  describe("create", () => {
    it("should create a report if user has permission", async () => {
      const context = mockContext({
        body: { client: secondUser.id, org: mockOrg.id, report: mockReport },
      });
      const result = await create(context as AuthenticatedContext);

      expect(result).toEqual({
        data: mockReport,
        message: "Report created successfully.",
      });
    });

    it("should throw UnauthorizedError if user does not have permission", async () => {
      const context = mockContext({
        permissions: {
          superAdmin: false,
          org: { id: mockOrg.id, role: UserRole.CLIENT },
        },
        user: secondUser,
        body: { client: mockUser.id, org: mockOrg.id, report: mockReport },
      });

      await expect(create(context as AuthenticatedContext)).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe("fetchOne", () => {
    it("should fetch a report if user has permission", async () => {
      const context = mockContext({
        user: mockUser,
        params: { report: mockReport.id },
      });

      const result = await fetchOne(context as AuthenticatedContext);

      expect(result).toEqual({
        data: mockReport,
        message: "Report fetched successfully.",
      });
    });

    it("should throw UnauthorizedError if user does not have permission", async () => {
      const context = mockContext({
        permissions: {
          superAdmin: false,
          org: { id: mockOrg.id, role: UserRole.CLIENT },
        },
        user: secondUser,
        params: { report: mockReport.id },
      });

      await expect(fetchOne(context as AuthenticatedContext)).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe("update", () => {
    it("should update a report if user has permission", async () => {
      const updatedAt = new Date();
      const context = mockContext({
        body: {
          client: secondUser.id,
          org: mockOrg.id,
          report: {
            ...mockReport,
            rating: 4,
          },
        },
      });

      const result = await update(context as AuthenticatedContext);

      expect(result).toEqual({
        data: {
          ...mockReport,
          rating: 4,
        },
        message: "Report updated successfully.",
      });
    });

    it("should throw UnauthorizedError if user does not have permission", async () => {
      const context = mockContext({
        permissions: {
          superAdmin: false,
          org: { id: mockOrg.id, role: UserRole.CLIENT },
        },
        user: secondUser,
        body: {
          client: mockUser.id,
          org: mockOrg.id,
          report: {
            ...mockReport,
            rating: 4,
          },
        },
      });

      await expect(update(context as AuthenticatedContext)).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });

  describe("deleteOne", () => {
    it("should delete a report if user has permission", async () => {
      const context = mockContext({
        params: { report: mockReport.id },
      });
      const result = await deleteOne(context as AuthenticatedContext);

      expect(result).toEqual({
        message: "Report deleted successfully.",
      });
    });

    it("should throw UnauthorizedError if user does not have permission", async () => {
      const context = mockContext({
        permissions: {
          superAdmin: false,
          org: { id: mockOrg.id, role: UserRole.CLIENT },
        },
        user: secondUser,
        params: { report: mockReport.id },
      });

      await expect(deleteOne(context as AuthenticatedContext)).rejects.toThrow(
        UnauthorizedError,
      );
    });
  });
});
