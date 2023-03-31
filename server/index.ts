import express, { Express, Request, Response } from "express";
import fs from "fs";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { Entry } from "./types";

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
  res.status(200).send(Object.values(db).filter((v) => v !== undefined));
});

// get specific - not used in assessment
router.get("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);
  res.status(200).send(db[productId]);
});

// add one
router.post("/", (req: Request, res: Response) => {
  // assumption from specs that incomplete forms won't be posted, not doing robust typechecks
  const data = req.body;

  if (data) {
    const newProductId = getFreeId();

    db[newProductId] = {
      ...data,
      productId: newProductId,
    };
    res.status(201).send(db[newProductId]);
    return;
  }

  res.sendStatus(500);
});

// edit specific
router.put("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);

  // assumption from specs that incomplete forms won't be posted, not doing robust typechecks
  const data = req.body;

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
      res.sendStatus(400);
      return;
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

  res.status(201).send(db[productId]);
});

// delete specific product
router.delete("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);

  if (!db[productId]) {
    res.sendStatus(200);
    return;
  }

  db[productId] = undefined;

  res.sendStatus(204);

  freeIds.push(productId);
  freeIds.sort();
});

/*

BONUS - Swagger Documentation
All API endpoints that created in order to develop the required frontend application functionality should be documented via Swagger.

The Swagger documentation should be consumed by anyone building the product on their local workstation at http://localhost:3000/api/api-docs.
 */

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
