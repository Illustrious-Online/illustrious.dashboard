import yoctocolors from "yoctocolors";

/**
 * Returns the duration message.
 *
 * @param {bigint} beforeTime The time before the request.
 * @returns {string}
 */
export function durationString(beforeTime: bigint): string {
  const now = process.hrtime.bigint();
  const timeDifference = now - beforeTime;
  const nanoseconds = Number(timeDifference);

  let timeMessage: string = "";

  if (nanoseconds >= 1e9) {
    const seconds = (nanoseconds / 1e9).toFixed(2);
    timeMessage = `| ${seconds}s`;
  } else if (nanoseconds >= 1e6) {
    const durationInMilliseconds = (nanoseconds / 1e6).toFixed(0);

    timeMessage = `| ${durationInMilliseconds}ms`;
  } else if (nanoseconds >= 1e3) {
    const durationInMicroseconds = (nanoseconds / 1e3).toFixed(0);

    timeMessage = `| ${durationInMicroseconds}µs`;
  } else {
    timeMessage = `| ${nanoseconds}ns`;
  }

  return timeMessage;
}

/**
 * Returns the duration message.
 * @param {string} method The method.
 * @returns {string}
 */
export function methodString(method: string): string {
  switch (method) {
    case "GET":
      return yoctocolors.white("GET");

    case "POST":
      return yoctocolors.yellow("POST");

    case "PUT":
      return yoctocolors.blue("PUT");

    case "DELETE":
      return yoctocolors.red("DELETE");

    case "PATCH":
      return yoctocolors.green("PATCH");

    case "OPTIONS":
      return yoctocolors.gray("OPTIONS");

    case "HEAD":
      return yoctocolors.magenta("HEAD");

    default:
      return method;
  }
}
