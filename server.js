//@ts-nocheck
const Butter = require("../butter");

const SESSIONS = [];

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

const parseJson = (req, res, next) => {
  if (req.headers["content-type"] === "application/json") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString("utf-8");
      console.log("Chunk after parse the body", chunk.toString("utf-8"));
    });
    req.on("end", () => {
      body = JSON.parse(body);
      req.body = body;
      next();
    });
  } else {
    next();
  }
};
// ------- MIDDLEWARES --------
server.beforeEach((req, res, next) => {
  const routes = ["/", "/login", "/profile", "/new-post"];
  if (routes.includes(req.url)) {
    return res.status(200).sendFile("./public/index.html", "text/html");
  }
  next();
});
server.beforeEach(parseJson);

// Authentication middleware
server.beforeEach((req, res, next) => {
  const routesToAuthenticate = [
    "GET /api/user",
    "POST /api/post",
    "PUT /api/user",
    "DELETE /api/logout",
  ];

  if (routesToAuthenticate.includes(req.method + " " + req.url)) {
    if (req.headers.cookie) {
      const token = req.headers.cookie.split("=")[1];
      console.log(SESSIONS);

      const session = SESSIONS.find((session) => session.token === token);
      if (session) {
        req.userId = session.userId;
        return next();
      }
      return res.status(401).json({ message: "Unauthorized" });
    }
  } else {
    next();
  }
});

// ------- FILES ROUTES --------

server.route("get", "/styles.css", (req, res) => {
  res.sendFile("./public/styles.css", "text/css");
});

server.route("get", "/scripts.js", (req, res) => {
  res.sendFile("./public/scripts.js", "text/javascript");
});

// ------- JSON ROUTES --------

// Get posts info..
server.route("get", "/api/posts", (req, res) => {
  const posts = POSTS.map((post) => {
    const user = USERS.find((user) => user.id === post.userId);
    post.author = user?.name;
    return post;
  });

  res.status(200).json(posts);
});

server.route("post", "/api/login", (req, res) => {
  const user = USERS.find(
    (user) =>
      user.username === req.body.username && user.password === req.body.password
  );

  if (!user) {
    res.status(401).json({ message: "Invalid credentials" });
  } else {
    const token = Math.floor(Math.random() * 10000000).toString();
    SESSIONS.push({ token, userId: user.id });
    res.setHeader("set-cookie", `token=${token}; path=/;`);
    res.status(200).json({ message: "Logged in successfully" });
  }
});

// Get user info..
server.route("get", "/api/user", (req, res) => {
  const user = USERS.find((user) => user.id === req.userId);
  res.status(200).json(user);
});

// Log user out..
server.route("delete", "/api/logout", (req, res) => {
  if (req.headers.cookie) {
    const token = req.headers.cookie.split("=")[1];
    SESSIONS.filter((session) => session.token !== token);
    return res.status(200).json({ message: "Logged out successfully" });
  }
  res.status(401).json({ message: "Unauthorized" });
});

// Update user info..
server.route("put", "/api/user", (req, res) => {});

// Create a new post..
server.route("post", "/api/posts", (req, res) => {});

server.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
