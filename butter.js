//@ts-nocheck
const http = require("node:http");
const fs = require("node:fs/promises");

class Butter {
  constructor() {
    this.server = http.createServer();
    this.routes = {};
    this.server.on("request", () => {
      console.log("A request has been received");
    });
    this.server.on("request", async (req, res) => {
      // Set the sendFile function for the response object
      res.sendFile = async (path, mime) => {
        ``;
        const fileHandle = await fs.open(path, "r");
        const fileStream = fileHandle.createReadStream();
        res.setHeader("Content-Type", mime);
        fileStream.pipe(res);

        fileStream.on("error", (err) => {
          res.statusCode = 500;
          res.end("Server Error");
        });
      };

      // Set the status code for the response
      res.status = (code) => {
        res.statusCode = code;
        return res;
      };

      res.json = (data) => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
      };
      console.log(this.routes);

      if (!this.routes[req.method.toLowerCase() + req.url]) {
        res.status(404).json({ error: `Cannot ${req.method} ${req.url}` });
        return;
      }
      this.routes[req.method.toLowerCase() + req.url](req, res);
    });
  }

  route(method, url, cb) {
    this.routes[method + url] = cb;
  }

  listen(port, cb) {
    this.server.listen(port, () => {
      cb();
    });
  }
}

module.exports = Butter;
