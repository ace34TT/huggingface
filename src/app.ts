import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { hf } from "./configs/huggingface.config";
import { deleteFile, saveFile } from "./helpers/file.helpers";
import { uploadFileToFirebase } from "./services/firebase.services";

const app = express();
app.use(cors());
app.use(bodyParser.json());
// !
app.post("/generate-image", async (req: Request, res: Response) => {
  const [prompt] = [req.body.prompt];
  const result = await hf.textToImage({
    model: "stabilityai/stable-diffusion-2",
    inputs: prompt,
    parameters: {
      negative_prompt: "blurry",
    },
  });
  const imageBuffer = Buffer.from(await result.arrayBuffer());
  const filename = await saveFile(imageBuffer);
  const url = await uploadFileToFirebase(filename!);
  console.log(url);
  deleteFile(filename!);
  // res.setHeader("Content-Type", "image/png");
  // res.send(imageBuffer);
  res.status(200).json({ url });
});

export { app };
