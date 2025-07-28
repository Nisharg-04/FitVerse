import winston from "winston";
import path from "path";

// Create a Winston logger with two transports: Console and File
const logger = winston.createLogger({
  level: "info", // Log level (info, error, warn, debug)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Store logs in JSON format
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(".", "logs", "error.log"),
      level: "error",
    }), // Store errors
    new winston.transports.File({
      filename: path.join(".", "logs", "combined.log"),
    }), // Store all logs
  ],
});

// If in development, also log to the console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export { logger };
