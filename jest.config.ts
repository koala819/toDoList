import type { Config } from "jest";
import dotenv from "dotenv";

// dotenv.config();
// dotenv.config({ path: "./.env.local" });
const result = dotenv.config({ path: "./.env.local" });
if (result.error) {
  console.error("Error loading .env.local:", result.error);
}

const config: Config = {
  verbose: true,
  testEnvironment: "jsdom",
  roots: ["<rootDir>/test"],
};

export default config;
