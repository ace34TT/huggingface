import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
app.use(cors());
app.use(bodyParser.json());
// !

app.get("/", async (req: Request, res: Response) => {
  return res.json({
    message: "Hello world",
  });
});

export { app };
