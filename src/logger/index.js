const path = require("path");
const bunyan = require("bunyan");

let log;

const init = () => {
  const logPath = path.resolve(
    __dirname,
    process.env.LOG_PATH || "../../logs/logs.log"
  );

  const env = process.env.NODE_ENV || "production";
  const level = env === "production" ? "warn" : "info";

  log = bunyan.createLogger({
    name: "Schools",
    streams: [
      {
        level,
        stream: process.stdout
      },
      {
        level,
        type: "rotating-file",
        path: logPath,
        period: "1d", // daily rotation
        count: 3 // keep 3 back copies
      }
    ]
  });

  log.debug("Logger initialized");

  return log;
};

const getLogger = () => (log ? log : init());

module.exports = getLogger;
