const express = require("express");
const logger = require("morgan");
const saunaRouter = require("./saunaRouter");

const app = express();

// Mount common middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routers
app.use(saunaRouter);

module.exports = app;
