import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
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

// Basic route for testing
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

export { app };
