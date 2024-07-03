import "dotenv/config";
import express, {
  type ErrorRequestHandler,
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import bodyParser from "body-parser";
import { PrismaClient } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import helmet from "helmet";
import upload from "express-fileupload";
import cors from "cors";
import path from "path";

import AppError from "./utils/appError.ts";
import globalErrorHandler from "./controller/errorController.ts";

import userRoutes from "./routes/userRoute.ts";
import adminRoutes from "./routes/adminRoute.ts";

const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(cors());
app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());
// app.use(busboy({ immediate: true }));

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "PGS gala ticketing system",
      version: "1.0.0",
      description: "API documentation for PGS gala ticketing system",
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve);
app.get("/api-docs", swaggerUi.setup(swaggerSpec));

// app.use(handler);

app.use("/admin", adminRoutes);
app.use(userRoutes);

app.get(/.*/, (req, res) => res.sendFile(__dirname + "/dist/index.html"));

export const prismaClient = new PrismaClient({
  log: ["error"],
});

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening in port ${PORT}`);
});
