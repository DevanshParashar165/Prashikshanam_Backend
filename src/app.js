import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routes/user.route.js";

const app = express()

app.use(cors({
    origin : "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use("/api/v1/users", userRouter)


app.use((err, req, res, next) => {
  console.error(err.stack); // prints error in Render logs
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;