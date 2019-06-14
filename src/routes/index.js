const express = require("express");
const rimraf = require("rimraf");
const archiver = require("archiver");
const contentDisposition = require("content-disposition");
const { executeAsync, mkdirAsync } = require("../utils");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Hello from index again.");
});

const time = () => {
  const [first, second] = process.hrtime();
  return first * 1000000 + second / 1000;
};

router.get("/test", async (req, res, next) => {
  try {
    const contentDispo = contentDisposition(`${new Date().getTime()}.zip`);
    res.header("Content-Type", `application/zip`);
    res.header("Content-Disposition", contentDispo);

    const directoryPath = `./generated/${new Date().getTime()}`;
    await mkdirAsync(directoryPath);

    console.log("begin time", time());

    console.log("Converting...");
    await executeAsync(
      `convert -density 300 test.pdf -trim "${directoryPath}/image.jpeg"`
    );
    console.log("Conversion succedeed.");

    const archive = archiver("zip", {
      zlib: { level: 9 } // Sets the compression level.
    });

    archive.pipe(res);
    archive.directory(`${directoryPath}`, false);

    res.on("finish", () => {
      console.log("file downloaded from: ", `${directoryPath}`);
      rimraf(directoryPath, error => {
        if (error) {
          console.log("Error when deleting temp directory", `${directoryPath}`);
        } else {
          console.log("Temp directory deleted:", `${directoryPath}`);
        }
        console.log("end time", time());
      });
    });

    archive.finalize();
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
