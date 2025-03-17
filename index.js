#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const projectName = process.argv[2] || "my-project";
const projectPath = path.join(process.cwd(), projectName);

if (fs.existsSync(projectPath)) {
  console.error("❌ Project already exists!");
  process.exit(1);
}

console.log(`🚀 Creating project: ${projectName}...\n`);
fs.mkdirSync(projectPath);
process.chdir(projectPath);

// 1️⃣ Backend Setup
console.log("🛠 Setting up backend...\n");
fs.mkdirSync("backend");
process.chdir("backend");

// Initialize package.json
execSync("npm init -y", { stdio: "inherit" });

// Modify package.json to add "type": "module"
const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
packageJson.type = "module";
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

// Install required backend dependencies
console.log("📦 Installing backend dependencies...\n");
execSync("npm install express dotenv", { stdio: "inherit" });
execSync("npm install --save-dev nodemon", { stdio: "inherit" });

// Create backend folders
["models", "controllers", "routes", "middlewares", "utils", "public"].forEach((folder) => fs.mkdirSync(folder));

// Create backend files
fs.writeFileSync(
  "index.js",
  `import app from './app.js';\nimport dotenv from 'dotenv';\ndotenv.config();\n\napp.listen(process.env.PORT || 5000, () => console.log('🚀 Server running on port', process.env.PORT || 5000));`
);
fs.writeFileSync(
  "app.js",
  `import express from 'express';\nconst app = express();\napp.use(express.json());\nexport default app;`
);
fs.writeFileSync("constant.js", `export const API_VERSION = 'v1';`);
fs.writeFileSync(".gitignore", "node_modules/\n.env");
fs.writeFileSync(".env", "PORT=5000");

process.chdir(".."); // Move back to root project folder

// 2️⃣ Frontend Setup (Default to JavaScript)
console.log("⚡ Setting up frontend with Vite (JavaScript)...\n");
fs.mkdirSync("frontend");
execSync("npm create vite@latest frontend -- --template react", { stdio: "inherit" });

process.chdir("frontend");

// Install frontend dependencies
console.log("\n📦 Installing frontend dependencies...\n");
execSync("npm install", { stdio: "inherit" });

// Start the frontend server
console.log("\n🚀 Starting frontend server...\n");
execSync("npm run dev", { stdio: "inherit" });

console.log("\n✅ Project setup completed successfully!");
