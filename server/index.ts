import express, { Express, Request, Response } from "express";
import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { Entry } from "./types";
import { validateData } from "./utils";

const app: Express = express();
const port = 3000;
const router = express.Router();

const dbData: Entry[] = JSON.parse(fs.readFileSync("db.json").toString());
const db = dbData.reduce<{ [key: number]: Entry | undefined }>((prev, curr) => {
  prev[curr.productId] = curr;
  return prev;
}, {});

const freeIds = [Object.keys(db).length];
const getFreeId = () => freeIds.shift() ?? Object.keys(db).length;

app.use(express.json());

//return all
router.get("/", (req: Request, res: Response) => {
  return res.status(200).send(Object.values(db).filter((v) => v !== undefined));
});

// get specific - not used in assessment
router.get("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);
  return res.status(200).send(db[productId]);
});

// add one
router.post("/", (req: Request, res: Response) => {
  // assumption from specs that incomplete forms won't be posted, not doing robust typechecks
  const data = req.body;

  if (!validateData(data)) {
    return res.status(400).send("Invalid JSON body");
  }

  if (data) {
    const newProductId = getFreeId();

    db[newProductId] = {
      ...data,
      productId: newProductId,
    };
    return res.status(201).send(db[newProductId]);
  }

  return res.sendStatus(500);
});

// edit specific
router.put("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);

  const data = req.body;

  if (!validateData(data)) {
    return res.status(400).send("Invalid JSON body");
  }

  if (db.hasOwnProperty(productId)) {
    if (productId in freeIds) {
      freeIds.splice(
        freeIds.findIndex((v) => v === productId),
        1
      );
      freeIds.sort();
    }
  } else {
    // api functionality not explicitly supported by front-end but wanted to have the coverage
    if (productId < 0) {
      return res.sendStatus(400);
    }

    // padding database with undefined products to maintain product id consistency
    for (
      let fillerId = Object.keys(db).length;
      fillerId < productId - 1;
      fillerId++
    ) {
      db[fillerId] = undefined;
      freeIds.push(fillerId);
    }
    freeIds.sort();
  }

  db[productId] = {
    ...data,
    productId,
  };

  return res.status(201).send(db[productId]);
});

// delete specific product
router.delete("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);

  if (!db[productId]) {
    return res.sendStatus(200);
  }

  db[productId] = undefined;

  res.sendStatus(204);

  freeIds.push(productId);
  freeIds.sort();

  return;
});

app.use("/api/product", router);

app.get("/api/hello", (req: Request, res: Response) => {
  res.status(200).send("Hello world!");
});

const specs = swaggerJSDoc({
  definition: {
    info: {
      title: "Assessment backend",
      version: "1.0.0",
      description:
        "This the the backend for the BC Public Service IMB assessment",
    },
    openapi: "3.0.0",
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./index.ts", ".build/index.js"],
});
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
