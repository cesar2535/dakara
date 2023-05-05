import fs from "fs";
import path, { resolve } from "path";

const appDir = fs.realpathSync(process.cwd());
const resolveApp = (relativePath: string) => path.resolve(appDir, relativePath);

const buildPath = process.env.BUILD_PATH || "dist";
const moduleFileExts = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
];

type ResolveFn = (path: string) => string;
const resolveModule = (resolveFn: ResolveFn, filePath: string) => {
  const extension = moduleFileExts.find((ext) =>
    fs.existsSync(resolveFn(`${filePath}.${ext}`))
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

export const dotenv = resolveApp(".env");
export const appPath = resolveApp(".");
export const appBuild = resolveApp(buildPath);
export const appPackageJson = resolveApp("package.json");
export const appSrc = resolveApp("src");
export const appTsConfig = resolveApp("tsconfig.json");
export const appJsConfig = resolveApp("jsconfig.json");
export const pnpmLockFile = resolveApp("pnpm-lock.yaml");
export const appNodeModules = resolveApp("node_modules");
