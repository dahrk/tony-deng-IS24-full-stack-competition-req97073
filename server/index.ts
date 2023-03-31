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

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         productId:
 *           type: number
 *           description: The id of the product
 *           example: 0
 *         productName:
 *           type: string
 *           description: The Product's name.
 *           example: Cool Application
 *         productOwnerName:
 *           type: string
 *           description: The Product Owner's name.
 *           example: John Doe
 *         developers:
 *           type: array
 *           description: The Product's name.
 *           example: ['Dev 1', 'Dev 2', 'Dev 3']
 *         scrumMasterName:
 *           type: string
 *           description: The Scrum Master's name.
 *           example: Jane Doe
 *         startDate:
 *           type: string
 *           description: The start date for the product.
 *           example: 2023/03/31
 *         methodology:
 *           type: string
 *           description: The management methodology.
 *           example: Agile
 */

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Retrieve an array of products.
 *     description: Retrieve an array of products from json.
 *     responses:
 *       200:
 *         description: A list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/Product'
 *   post:
 *      summary: Add a new product
 *      description: Adds a new product
 *      requestBody:
 *        description: Create a new product
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *        required: true
 *      responses:
 *          201:
 *            description: Successful operation
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Product'
 *          400:
 *            description: Invalid JSON body
 */
router.get("/", (req: Request, res: Response) => {
  return res.status(200).send(Object.values(db).filter((v) => v !== undefined));
});

router.post("/", (req: Request, res: Response) => {
  const data = req.body;

  if (!validateData(data)) {
    return res.status(400).send("Invalid JSON body");
  }

  const newProductId = getFreeId();

  db[newProductId] = {
    ...data,
    productId: newProductId,
  };
  return res.status(201).send(db[newProductId]);
});

/**
 * @swagger
 * /product/{productId}:
 *   get:
 *     summary: Retrieve a specific product.
 *     description: Retrieve a specific product from json.
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: id of product to get
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *     responses:
 *       200:
 *         description: A single product.
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid productId
 *   put:
 *      summary: Update a specific product.
 *      description: Update a specific product.
 *      parameters:
 *      - name: productId
 *        in: path
 *        description: id of product to update
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *      requestBody:
 *        description: Update a specific product
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Product'
 *        required: true
 *      responses:
 *          201:
 *            description: Successful operation
 *            content:
 *              application/json:
 *                schema:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/Product'
 *          400:
 *            description: Invalid productId or JSON body
 *   delete:
 *     summary: Delete a specific product.
 *     description: Delete a specific product from json.
 *     parameters:
 *      - name: productId
 *        in: path
 *        description: id of product to delete
 *        required: true
 *        schema:
 *          type: integer
 *          format: int64
 *     responses:
 *       200:
 *         description: No product with productId in data.
 *       204:
 *         description: Deleted product with productId
 *       400:
 *         description: Invalid productId
 */
router.get("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).send("Invalid input");
  }

  return res.status(200).send(db[productId]);
});

router.put("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);

  const data = req.body;

  if (!validateData(data) || isNaN(productId)) {
    return res.status(400).send("Invalid input");
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

router.delete("/:productId", (req: Request, res: Response) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).send("Invalid input");
  }

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

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Server health check.
 *     description: Returns a string if server is available.
 *     responses:
 *       200:
 *         description: Success.
 *         content:
 *           text/html:
 *            schema:
 *              type: string
 *              example: Hello world!
 */

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
        url: "http://localhost:3000/api",
      },
    ],
  },
  apis: ["./index.ts", ".build/index.js"],
});
app.use("/api/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
