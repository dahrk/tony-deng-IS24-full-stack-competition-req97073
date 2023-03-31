import dayjs from "dayjs";

import { Entry } from "./types";

export const defaultProduct: Entry = {
  productId: -1,
  productName: "",
  productOwnerName: "",
  developers: [""],
  scrumMasterName: "",
  startDate: dayjs(new Date()).format("YYYY/MM/DD"),
  methodology: "Agile",
};

export const handleFetchError = (e: any) => {
  if (e instanceof Error) {
    console.error(e.message);
  }
};
