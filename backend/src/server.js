import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`------------------------------------------------`);
  console.log(` Listening on   -> http://localhost:${PORT}`);
  console.log(` Documentation  -> http://localhost:${PORT}/docs`);
  console.log(`------------------------------------------------`);
});