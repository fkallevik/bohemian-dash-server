const express = require("express");
const logger = require("morgan");
const saunaRouter = require("./saunaRouter");
const authRouter = require("./authRouter");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Enable all CORS requests for now
app.use(cors());

// Mount common middleware
app.use(logger("dev"));
app.use(
  logger("common", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routers
app.use(saunaRouter);
app.use(authRouter);

module.exports = app;
