const http = require("node:http");

const agent = new http.Agent({ keepAlive: true });

const request = http.request({
  agent,
  host: "localhost",
  port: 8000,
  method: "POST",
  path: "/create-post",
  headers: {
    "Content-Type": "application/json",
    // "Content-Length": Buffer.byteLength(
    //   // Content length  || transferred chunks
    //   JSON.stringify({ title: "foo", body: "bar", userId: 1 })
    // ),
    name: "John Doe",
  },
});

// This event is only triggered once
request.on("response", (res) => {
  console.log("------ STATUS ------");
  console.log(res.statusCode);

  console.log("------ HEADERS ------");
  console.log(res.headers);

  console.log("------ BODY ------");

  res.on("data", (chunk) => {
    console.log(chunk.toString("utf-8"));
  });
  console.log(res);

  res.on("end", () => {
    console.log("This is the end of the response");
  });
});

// request.write(JSON.stringify({ title: "foo", body: "bar", userId: 1 }));
request.end(JSON.stringify({ title: "foo", body: "bar", userId: 1 }));
