import express from "express";
import dotenv from "dotenv";

const app = express();
app.use(express.json());

dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log("Listen on http://localhost:" + PORT || 3000);
})