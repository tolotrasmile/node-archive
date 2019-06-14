const fs = require("fs");
const { exec } = require("child_process");
const { promisify } = require("util");

const mkdirAsync = promisify(fs.mkdir);

function executeAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

module.exports = { executeAsync, mkdirAsync };
