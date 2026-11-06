import { build } from "esbuild";
import { rmSync, mkdirSync, writeFileSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
mkdirSync("dist");

await build({
  entryPoints: ["src/app.ts"],
  outfile: "dist/app.js",
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",

  banner: {
    js: 'import { createRequire } from "node:module"; const require = createRequire(import.meta.url);',
  },

  external: [
    "kerberos",
    "snappy",
    "aws4",
    "mongodb-client-encryption",
    "@mongodb-js/zstd",
    "@aws-sdk/credential-providers",
    "gcp-metadata",
    "socks",
  ],
  logLevel: "info",
});

writeFileSync("dist/package.json", JSON.stringify({ type: "module" }));
