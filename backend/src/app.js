import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { logger } from "./utils/logger.js";
import { ApiResponse } from "./utils/ApiResponse.js";
const app = express();

// CORS options on the backend
const corsOptions = {
  origin: `${process.env.FRONTEND_HOST}:${process.env.FRONTEND_PORT}`, // Match the frontend origin
  credentials: true, // Allow sending cookies
};

// CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse cookies
app.use(cookieParser());

// Middleware to log each request
app.use((req, res, next) => {
  logger.info({
    message: "Incoming request",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  });
  next();
});

// Basic route for testing
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

import userRoutes from "./routes/user.route.js";

// Use user routes
app.use("/api/user", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    status: err.statusCode || 500,
    stack: err.stack,
  });

  res.status(err.statusCode || 500).json(
    new ApiResponse({
      statusCode: err.statusCode || 500,
      message: err.message,
      data: null,
      success: false,
    })
  );
});

export { app };
