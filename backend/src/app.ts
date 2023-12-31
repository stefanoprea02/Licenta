import createError from "http-errors";
import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import { gamesRouter } from "./game/games.router";
import { genresRouter } from "./genre/genres.router";
import { languagesRouter } from "./language/languages.router";
import { platformsRouter } from "./platform/platforms.router";
import { tagsRouter } from "./tag/tags.router";
import { usersRouter } from "./user/users.router";
import http from "http";
import Bootstrap from "./bootstrap";

dotenv.config();

const app: Application = express();

const corsOptions: cors.CorsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const imagesDirectory = path.resolve(__dirname, "../images");
const gamesDirectory = path.resolve(__dirname, "../games");
app.use("/images", express.static(imagesDirectory));
app.use("/games", express.static(gamesDirectory));

app.use(
  "/games",
  express.static(gamesDirectory, {
    index: false, // Disable index.html serving by default
  })
);

// Custom middleware to serve HTML files explicitly
app.use("/games", (req, res, next) => {
  const requestedFile = path.join(gamesDirectory, req.path);

  // Check if the requested file is an HTML file
  if (path.extname(requestedFile).toLowerCase() === ".html") {
    res.sendFile(requestedFile);
  } else {
    next(); // Pass control to the next middleware
  }
});

app.use("/games", gamesRouter);
app.use("/genres", genresRouter);
app.use("/languages", languagesRouter);
app.use("/platforms", platformsRouter);
app.use("/tags", tagsRouter);
app.use("/users", usersRouter);

Bootstrap();

// catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // Add your error rendering logic here
});

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);

const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function normalizePort(val: string) {
  const normalizedPort = parseInt(val, 10);

  if (isNaN(normalizedPort)) {
    // named pipe
    return val;
  }

  if (normalizedPort >= 0) {
    // port number
    return normalizedPort;
  }

  return false;
}

function onError(error: { syscall: string; code: any }) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind =
    typeof addr === "string"
      ? "pipe " + addr
      : "port " + (addr ? addr.port : "");
  console.log("Listening on " + bind);
}

export = app;
