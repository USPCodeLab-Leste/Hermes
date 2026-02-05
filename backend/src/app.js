import "./config/env.js";

import express from "express";
import cookieParser from "cookie-parser";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger/swagger.js";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import eventsRoutes from "./routes/events.route.js";
import muralRoutes from "./routes/mural.route.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRoutes);
app.use(userRoutes);
app.use(eventsRoutes);
app.use(muralRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`------------------------------------------------`);
  console.log(` Listening on   -> http://localhost:${PORT}`);
  console.log(` Documentation  -> http://localhost:${PORT}/docs`);
  console.log(`------------------------------------------------`);
});