const fs = require("fs");
const rimraf = require("rimraf");
const chalk = require("chalk");
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

function rimrafAsync(directory) {
  return new Promise((resolve, reject) => {
    rimraf(directory, error => (error ? reject(error) : resolve("ok")));
  });
}

function time() {
  const [first, second] = process.hrtime();
  return first * 1000000 + second / 1000;
}

function log(...args) {
  console.log(chalk.blue(`[${new Date().toString()}]: `), ...args);
}

module.exports = { executeAsync, mkdirAsync, time, rimrafAsync, log };
