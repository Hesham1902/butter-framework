const Butter = require("../butter");

const server = new Butter();

const PORT = 4060;

server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/style.css", (req, res) => {
  res.sendFile("./public/style.css", "text/css");
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
