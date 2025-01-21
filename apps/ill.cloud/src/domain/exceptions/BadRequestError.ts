import { StatusCodes } from "http-status-codes";

export default class BadRequestError extends Error {
  public status: number;

  constructor(public message: string) {
    super(message);

    console.error(message);
    this.status = StatusCodes.BAD_REQUEST;
  }
}
