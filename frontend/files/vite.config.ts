import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      https: {
        key: fs.readFileSync("./ssl/key.pem"),
        cert: fs.readFileSync("./ssl/certificate.pem"),
      },
      host: env.VITE_HOST || "0.0.0.0",
      port: Number(env.VITE_PORT) || 3000,
    },
  };
});
