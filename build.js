const { copyFileSync, mkdirSync } = require("node:fs");
const { join } = require("node:path");

const outputDirectory = join(__dirname, "dist");
mkdirSync(outputDirectory, { recursive: true });

for (const file of ["index.html", "styles.css", "app.js"]) {
  copyFileSync(join(__dirname, file), join(outputDirectory, file));
}

console.log("Static site built in dist/");
