import { Request, Response } from "express";
import { hf } from "../configs/huggingface.config";
import { saveFile, deleteFile, uploadFile } from "../helpers/file.helpers";
import { uploadFileToFirebase } from "../services/firebase.services";
import axios from "axios";
import fs from "fs";
import path from "path";
const tempDirectory = path.resolve(__dirname, "../tmp/");
export const textToImageHandler = async (req: Request, res: Response) => {
  try {
    const [prompt, model] = [req.body.prompt, req.body.model];
    console.log(prompt);
    console.log("making request with ", model);
    const result = await hf.textToImage({
      model: model ? model : "stabilityai/sdxl-turbo",
      inputs: prompt,
      parameters: {
        negative_prompt: "blurry",
        height: 1024,
        width: 1024,
      },
    });
    console.log("uploading data");
    const url = await uploadFile(result);
    // res.setHeader("Content-Type", "image/png");
    // res.send(imageBuffer);
    res.status(200).json({ url });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error occurred" });
  }
};
export const textToImage2Handler = async (req: Request, res: Response) => {
  try {
    const URL =
      "https://api-inference.huggingface.co/models/stabilityai/sdxl-turbo";
    const API_KEY = "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"; // replace with your Hugging Face API key
    const response = await axios.post(
      URL,
      { inputs: "a dancing cat" },
      { headers: { Authorization: `Bearer ${API_KEY}` } }
    );
    const imageData = response.data;
    // const imageData = await response;
    // console.log(imageData);
    console.log(imageData);
    // process the image data as needed
    res.status(200).json({ message: "Done !" });
  } catch (error) {
    console.trace(error);
    return res.status(500).json({ message: "Error occurred" });
  }
};
export const imageToImageHandler = async (req: Request, res: Response) => {
  try {
    console.log("processing");
    const result = await hf.imageToImage({
      inputs: new Blob([
        fs.readFileSync(
          path.resolve(
            tempDirectory,
            "stefan-stefancik-QXevDflbl8A-unsplash.jpg"
          )
        ),
      ]),
      parameters: {
        prompt: "a futuristic viking",
      },
      model: "lllyasviel/sd-controlnet-depth",
    });
    console.log("done");
    const url = await uploadFile(result);
    res.status(200).json({ url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error" });
  }
};
