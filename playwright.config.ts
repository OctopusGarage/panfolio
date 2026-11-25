import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests",
  testMatch: "*.spec.ts",
  use: { locale: "zh-CN", baseURL: "http://127.0.0.1:4173" },
  webServer: {
    command: "pnpm exec vite preview --host 127.0.0.1 --port 4173",
    port: 4173,
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    {
      name: "webkit",
      use: { browserName: "webkit", viewport: { width: 390, height: 844 } },
    },
  ],
});
