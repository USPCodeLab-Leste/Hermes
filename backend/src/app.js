import "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger/swagger.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import eventsRoutes from "./routes/events.route.js";
import infosRoutes from "./routes/infos.route.js";
import muralRoutes from "./routes/mural.route.js";
import tagRoutes from "./routes/tag.route.js";

const app = express();

app.set("trust proxy", 1);

const backUrl = process.env.BASE_URL;
const frontUrl = process.env.FRONT_URL;
app.use(cors({
  origin: [
    backUrl,
    frontUrl
  ],
  credentials: true
}));

app.use(helmet()); // Help secure by setting HTTP response headers
app.use(express.json());
app.use(cookieParser());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use(userRoutes);
app.use(eventsRoutes);
app.use(infosRoutes);
app.use(muralRoutes);
app.use(tagRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`-------- Servidor rodando em ${process.env.NODE_ENV} --------`);
  console.log(`------------------------------------------------`);
  console.log(` Listening on   -> http://localhost`);
  console.log(` Documentation  -> http://localhost/docs`);
  console.log(`------------------------------------------------`);
});