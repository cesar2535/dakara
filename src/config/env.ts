import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import fs from "fs";
import path from "path";
import * as paths from "./paths";

type NodeEnv = "production" | "staging" | "test" | "development";
const NODE_ENV = (process.env.NODE_ENV || "development") as NodeEnv;

if (!NODE_ENV) {
  throw new Error(
    "The NODE_ENV environment variable is required but was not specified"
  );
}

const dotenvFiles = [
  `${paths.dotenv}.${NODE_ENV}.local`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== "test" && `${paths.dotenv}.local`,
  `${paths.dotenv}.${NODE_ENV}`,
  paths.dotenv,
].filter(Boolean) as string[];

dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    dotenvExpand.expand(dotenv.config({ path: dotenvFile }));
  }
});

const appDir = fs.realpathSync(process.cwd());
process.env.NODE_PATH = (process.env.NODE_PATH || "")
  .split(path.delimiter)
  .filter((folder) => folder && !path.isAbsolute(folder))
  .map((folder) => path.resolve(appDir, folder))
  .join(path.delimiter);
