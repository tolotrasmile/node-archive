const express = require("express");
const app = express();
const morgan = require("morgan");

// Routes
const indexRouter = require("./src/routes/index");

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("Server ready");
});
