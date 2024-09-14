const http = require("node:http");
const fs = require("node:fs/promises");

const server = http.createServer();

server.on("request", async (request, response) => {
  if (request.url === "/" && request.method === "GET") {
    const fileHandle = await fs.open("./public/index.html", "r");
    const fileStream = fileHandle.createReadStream();

    // Set the appropriate header for HTML
    response.setHeader("Content-Type", "text/html");

    // Use pipe to send the file stream to the response
    fileStream.pipe(response);

    // Handle stream errors (e.g., file not found)
    fileStream.on("error", (err) => {
      response.statusCode = 500;
      response.end("Server Error");
    });
  }

  if (request.url === "/style.css" && request.method === "GET") {
    const fileHandle = await fs.open("./public/style.css", "r");
    const fileStream = fileHandle.createReadStream();

    // Set the appropriate header for HTML
    response.setHeader("Content-Type", "text/html");

    // Use pipe to send the file stream to the response
    fileStream.pipe(response);

    // Handle stream errors (e.g., file not found)
    fileStream.on("error", (err) => {
      response.statusCode = 500;
      response.end("Server Error");
    });
  }

  if (request.url === "/login" && request.method === "POST") {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ message: "Login successful" }));
  }

  if (request.url === "/upload" && request.method === "POST") {
    response.setHeader("Content-Type", "application/json");
    const fileHandle = await fs.open("./storage/image.jpeg", "w");
    const fileStream = fileHandle.createWriteStream();

    request.pipe(fileStream);

    request.on("end", () => {
      response.end(JSON.stringify({ message: "Upload successful" }));
    });
  }
});

server.listen(9000, "127.0.0.1", () => {
  console.log("Web server is live at http://127.0.0.1:9000");
});
