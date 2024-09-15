//@ts-nocheck
const Butter = require("../butter");

const USERS = [
  {
    id: 1,
    name: "John Doe",
    username: "john",
    password: "string",
  },
  {
    id: 2,
    name: "Jane smith",
    username: "jane",
    password: "string",
  },
  {
    id: 3,
    name: "Jim fisher",
    username: "jim",
    password: "string",
  },
];

const POSTS = [
  {
    id: 1,
    title: "Post 1",
    body: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur",
    userId: 1,
  },
];

const server = new Butter();

const PORT = 8000;

// ------- FILES ROUTES --------
server.route("get", "/", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

server.route("get", "/login", (req, res) => {
  res.sendFile("./public/index.html", "text/html");
});

// ------- JSON ROUTES --------
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user?.name;
    return post;
  });

  res.status(200).json(posts);
});

server.route("post", "/api/login", (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString("utf-8");
    console.log(chunk.toString("utf-8"));
  });
  req.on("end", () => {
    body = JSON.parse(body);

    const user = USERS.find(
      (user) =>
        user.username === body.username && user.password === body.password
    );

    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    } else {
      loggedUser = user;
      res.status(200).json({ message: "Logged in successfully" });
    }
  });
});

server.route("get", "/api/user", (req, res) => {
  res.status(200).json(loggedUser);
});

server.route("delete", "/api/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
