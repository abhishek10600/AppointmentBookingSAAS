import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import app from "./app.js";

const PORT = process.env.PORT || 4001;

// console.log(process.env.CORS_ORIGINS);

app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
