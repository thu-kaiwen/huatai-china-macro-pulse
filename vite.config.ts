import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { sites } from "./build/sites-vite-plugin.ts";

export default defineConfig(async ({ mode }) => {
  const hostingPlugins = [];

  if (mode !== "test") {
    const { cloudflare } = await import("@cloudflare/vite-plugin");
    hostingPlugins.push(
      cloudflare({
        config: {
          main: "./worker/index.ts",
          compatibility_flags: ["nodejs_compat"],
        },
      }),
    );
  }

  return {
    plugins: [
      react(),
      sites(),
      ...hostingPlugins,
    ],
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setup.ts"],
      css: true,
      exclude: ["e2e/**", "node_modules/**", "dist/**", ".worktrees/**"],
    },
  };
});
