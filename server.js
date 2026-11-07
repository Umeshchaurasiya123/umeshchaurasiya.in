const { createServer } = require("node:http");
const { readFile } = require("node:fs/promises");
const { join } = require("node:path");

const port = Number(process.env.PORT || 3000);
const files = new Map([
  ["/", ["index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["styles.css", "text/css; charset=utf-8"]],
  ["/app.js", ["app.js", "text/javascript; charset=utf-8"]],
]);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error(`Invalid PORT: ${process.env.PORT}`);
}

const server = createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end("Method not allowed");
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, `http://localhost:${port}`).pathname;
  } catch (error) {
    response.writeHead(400);
    response.end("Bad request");
    return;
  }

  const file = files.get(pathname);
  if (!file) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  try {
    const content = await readFile(join(__dirname, file[0]));
    response.writeHead(200, {
      "Content-Type": file[1],
      "Content-Length": content.length,
    });
    response.end(request.method === "HEAD" ? undefined : content);
  } catch (error) {
    console.error(`Unable to serve ${file[0]}:`, error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal server error");
  }
});

server.on("error", (error) => {
  console.error("Development server failed:", error);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Meridian is running at http://localhost:${port}`);
});
