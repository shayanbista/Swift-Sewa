import express from "express";
import "reflect-metadata";

import cors from "cors";
import helmet from "helmet";

import config from "./config";
import { genericErrorHandler } from "./middleware/errorHandler";
import router from "./route";
import { RequestLogger } from "./middleware/logger";

const app = express();

app.use(helmet());

app.use(
  cors({
    allowedHeaders: "*",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// router middleware
app.use(router);

// calling DB

app.use(RequestLogger);

app.use(genericErrorHandler);

app.listen(config.port, () => {
  console.log(`app is listening on ${config.port}`);
});
