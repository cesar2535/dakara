import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "main",
    entry: ["src/main.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    bundle: true,
    sourcemap: true,
    splitting: false,
    clean: true,
    dts: false,
  },
  {
    name: "typedefs",
    entry: ["./src/main.ts"],
    clean: false,
    dts: { only: true },
  },
]);
