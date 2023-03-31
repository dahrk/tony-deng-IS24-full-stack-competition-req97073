import { Request } from "express";

import { Entry } from "./types";

export const validateData = (body: Request["body"]): body is Entry => {
  const conditions = [
    "productId" in body && typeof body.productId === "number",
    "productName" in body && typeof body.productName === "string",
    "productOwnerName" in body && typeof body.productOwnerName === "string",
    "developers" in body &&
      Array.isArray(body.developers) &&
      body.developers.length > 0 &&
      Array.from(body.developers).every((d) => typeof d === "string"),
    "scrumMasterName" in body && typeof body.scrumMasterName === "string",
    "startDate" in body && typeof body.startDate === "string",
    "methodology" in body && typeof body.methodology === "string",
  ];

  return conditions.every(Boolean);
};
