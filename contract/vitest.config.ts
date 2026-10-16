import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/pack.ts", "src/witnesses.ts"],
      reporter: ["text-summary", "json-summary"],
    },
  },
});
