type LogLevel = "info" | "warn" | "error" | "debug";

const shouldDebug = (level: LogLevel) =>
  level !== "debug" || process.env.NODE_ENV !== "production";

export const logger = {
  log(level: LogLevel, message: string) {
    if (!shouldDebug(level)) return;
    const timestamp = new Date().toISOString();
    // eslint-disable-next-line no-console
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  },
  info(message: string) {
    this.log("info", message);
  },
  warn(message: string) {
    this.log("warn", message);
  },
  error(message: string) {
    this.log("error", message);
  },
  debug(message: string) {
    this.log("debug", message);
  },
};
