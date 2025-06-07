import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger.ts";
const app = express();
app.use(
        cors({
                origin: process.env.CORS_ORIGIN,
                credentials: true,
        })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
// routes import
import userRouter from "./routes/user.routes.ts";
// routes decleration
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1/users", userRouter);

export { app };