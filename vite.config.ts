import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolvePagesBase } from "./build/pages-base.ts";
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
    // base: resolvePagesBase(process.env.PAGES_REPOSITORY_NAME),
    base: resolvePagesBase(""),
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
