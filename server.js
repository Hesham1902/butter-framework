const http = require("node:http");

const server = http.createServer((req, res) => {
  console.log("------ METHODS ------");
  // For http/1.1 method are in separate field inside request
  console.log(req.method);

  console.log("------ HEADERS ------");
  console.log(req.headers);

  console.log("------ URL ------");
  console.log(req.url);

  console.log("------ BODY ------");
  let data = "";
  req.on("data", (chunk) => {
    data += chunk.toString("utf-8");
    console.log(data);
  });

  req.on("end", () => {
    data = JSON.parse(data);

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        //@ts-ignore
        message: `Post with title: ${data.title} was created by user with id: ${data.userId}`,
      })
    );
  });
});

server.listen("8000", () => {
  console.log("Server listening on http://localhost:8000");
});
