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

<<<<<<< HEAD
import adsRoutes from "./routes/ads.routes.js";
app.use("/api/advertisement", adsRoutes);

import adsViewRoutes from "./routes/ads-view.routes.js";
app.use("/api/advertisement-view", adsViewRoutes);

import chatroutes from "./routes/chatbot.routes.js";
app.use("/api/chatbot", chatroutes);


=======
import userRoutes from "./routes/user.route.js";
import gymRoutes from "./routes/gym.route.js";
import adminRoutes from "./routes/admin.route.js";
import adsRoutes from "./routes/ads.routes.js";

// Use user routes
app.use("/api/user", userRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/advertisement", adsRoutes);

>>>>>>> d9553b2d8aee4aa72ce182bccba71b28a4d94f9c
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
