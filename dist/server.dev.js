"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _app = _interopRequireDefault(require("./app.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

process.on('uncaughtException', function (err) {
  console.log(err.name, err.message);
  console.log('Uncaught Exception');
  process.exit(1);
});

_dotenv["default"].config({
  path: './config.env'
});

var DB = process.env.DATABASE;

_mongoose["default"].connect(DB).then(function (conn) {
  console.log('Database connected seccessful!');
});

var port = process.env.PORT || 7000;

var server = _app["default"].listen(port, function () {
  return console.log("Sever Running On Port ".concat(port, "!"));
});

process.on('unhandledRejection', function (err) {
  console.log(err.name, err.message);
  console.log('Unhandled Rejection ');
  server.close(function () {
    process.exit(1);
  });
});