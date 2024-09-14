const Butter = require("./butter");

const server = new Butter();

const PORT = 4060;

server.route("get", "/", (req, res) => {
  res.status(200).sendFile("./public/index.html", "text/html");
});

server.route("put", "/upload", (req, res) => {
  res.status(404).sendFile("");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
