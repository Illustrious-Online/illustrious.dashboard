let colors: any;
import("yoctocolors").then((module) => {
  colors = module.default;
});

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
      return colors.white("GET");

    case "POST":
      return colors.yellow("POST");

    case "PUT":
      return colors.blue("PUT");

    case "DELETE":
      return colors.red("DELETE");

    case "PATCH":
      return colors.green("PATCH");

    case "OPTIONS":
      return colors.gray("OPTIONS");

    case "HEAD":
      return colors.magenta("HEAD");

    default:
      return method;
  }
}
