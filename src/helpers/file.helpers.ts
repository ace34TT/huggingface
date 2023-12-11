import fs from "fs";
import path from "path";
import util from "util";
import { uploadFileToFirebase } from "../services/firebase.services";

const assetsDirectory = path.resolve(__dirname, "../assets/");
const tempDirectory = path.resolve(__dirname, "../tmp/");

const writeFile = util.promisify(fs.writeFile);

export const generateRandomString = (length: number) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
export const saveFile = async (
  imageBuffer: string | NodeJS.ArrayBufferView
) => {
  tmpFolderGuard();
  const filename = generateRandomString(10);
  try {
    await writeFile(
      path.resolve(tempDirectory, filename + ".jpeg"),
      imageBuffer
    );
    console.log("The file has been saved!");
    return filename + ".jpeg";
  } catch (err) {
    console.error(err);
  }
};
export const tmpFolderGuard = () => {
  if (!fs.existsSync(tempDirectory)) {
    fs.mkdirSync(tempDirectory, { recursive: true });
  }
};
export const deleteFile = async (filename: string) => {
  console.log("deleting : " + path.resolve(tempDirectory, filename));
  fs.unlinkSync(path.resolve(tempDirectory, filename));
};
export const uploadFile = async (result: any): Promise<any> => {
  const imageBuffer = Buffer.from(await result.arrayBuffer());
  const filename = await saveFile(imageBuffer);
  const url = await uploadFileToFirebase(filename!);
  console.log(url);
  deleteFile(filename!);
  return url;
};
