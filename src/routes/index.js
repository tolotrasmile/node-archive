const express = require("express");
const archiver = require("archiver");
const contentDisposition = require("content-disposition");
const { executeAsync, mkdirAsync, rimrafAsync, log } = require("../utils");
const router = express.Router();

router.get("/", (_, res) => {
  res.send("Hello from index again.");
});

router.get("/test", async (_, res) => {
  try {
    const contentDispo = contentDisposition(`${new Date().getTime()}.zip`);
    res.header("Content-Type", `application/zip`);
    res.header("Content-Disposition", contentDispo);
    await convertFile("test.pdf", res);
  } catch (error) {
    console.error(error);
  }
});

async function convertFile(file, response) {
  const startHrTime = process.hrtime();

  const directoryPath = `./generated/${new Date().getTime()}`;
  await mkdirAsync(directoryPath);

  log("Converting...");

  await executeAsync(
    `convert -density 300 "${file}" -trim "${directoryPath}/image.jpeg"`
  );

  log("Conversion succedeed.");

  const archive = archiver("zip", {
    zlib: { level: 9 } // Sets the compression level.
  });

  archive.pipe(response);
  archive.directory(`${directoryPath}`, false);

  response.on("finish", async () => {
    log("File downloaded from: ", `${directoryPath}`);
    try {
      await rimrafAsync(directoryPath);
      log("Temp directory deleted:", `${directoryPath}`);
    } catch (error) {
      log(error);
      log("Error when deleting temp directory", `${directoryPath}`);
    }
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedHrTimeMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
    log(`Response > ${elapsedHrTimeMs} ms`);
  });

  archive.finalize();
}

module.exports = router;
