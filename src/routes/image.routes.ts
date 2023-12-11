import express from "express";
import {
  imageToImageHandler,
  textToImage2Handler,
  textToImageHandler,
} from "../controllers/image.controllers";

const router = express.Router();

router.post("/text-to-image", textToImageHandler);
// router.post("/text-to-image-2", textToImage2Handler);
// router.post("/image-to-image", imageToImageHandler);
// router.post("/ask", makeQueryHandler);

export { router as imageRoutes };
