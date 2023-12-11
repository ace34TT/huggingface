import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { imageRoutes } from "./routes/image.routes";

const app = express();
app.use(cors());
app.use(bodyParser.json());
// !
app.use("/api/image", imageRoutes);

export { app };
