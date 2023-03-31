import AddIcon from "@mui/icons-material/Add";
import { Button, Grid, TextField } from "@mui/material";
import React, { ChangeEvent } from "react";

import { defaultProduct } from "../utils";
import { Entry } from "../types";

type AppHeaderProps = {
  dataFilter: string;
  displayData?: Entry[];
  modalOpen: () => void;
  setDataFilter: React.Dispatch<React.SetStateAction<string>>;
  setModalProduct: React.Dispatch<React.SetStateAction<Entry>>;
};

// Inputs above the main table for interativity and story requirements
export const AppHeader = ({
  dataFilter,
  displayData,
  modalOpen,
  setDataFilter,
  setModalProduct,
}: AppHeaderProps) => {
  return (
    <Grid container flexDirection="column">
      <Grid item>
        <p>{`${
          dataFilter
            ? "The number of filtered products is"
            : "The total number of products is"
        } ${displayData?.length ?? 0}`}</p>
      </Grid>
      <Grid item display="flex" flexDirection="row">
        <Grid item xs={6}>
          <TextField
            id="filter"
            inputProps={{ sx: { width: "400px" } }}
            label="Scrum Master and Developer Search"
            name="filter"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setDataFilter(e.target.value);
            }}
            value={dataFilter}
          />
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={() => {
              setModalProduct({
                ...defaultProduct,
                developers: [...defaultProduct.developers],
              });
              modalOpen();
            }}
            variant="contained"
          >
            <AddIcon /> Add new product
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
