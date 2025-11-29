import express from "express";
import cors from "cors";

import authRoutes from "./app/routes/auth.route.js";
import bookRoutes from "./app/routes/book.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);

export default app;
