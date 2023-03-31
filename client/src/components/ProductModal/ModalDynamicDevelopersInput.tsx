import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import { Box, Button, IconButton, TextField } from "@mui/material";
import React, { ChangeEvent, ComponentProps } from "react";

import { Entry } from "../../../../server/types";

type ModalDynamicDevelopersInputProps = {
  developers: string[];
  setProduct: (value: React.SetStateAction<Entry>) => void;
  textFieldProps: ComponentProps<typeof TextField>;
};

export const ModalDynamicDevelopersInput = ({
  developers,
  setProduct,
  textFieldProps,
}: ModalDynamicDevelopersInputProps) => {
  return (
    <>
      {developers.map((developer, i) => {
        return (
          <Box
            // if two developers have the same name, this may throw an error. Can be addressed with some refactoring or the usage of developer id's
            key={`developer${i}`}
            sx={{ display: "flex", flexDirection: "row", mx: 2, my: 1 }}
          >
            <TextField
              {...textFieldProps}
              name={`developer${i}`}
              label={`Developer ${i + 1}`}
              sx={{}}
              value={developer}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const { value } = e.target;
                setProduct((prev) => {
                  const newProduct = { ...prev };
                  newProduct.developers[i] = value;
                  return newProduct;
                });
              }}
            />
            <IconButton
              disabled={developers.length < 2}
              onClick={() => {
                setProduct((prev) => {
                  const newProduct = { ...prev };
                  newProduct.developers.splice(i, 1);
                  return newProduct;
                });
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        );
      })}
      <Button
        disabled={developers.length > 4}
        onClick={() => {
          setProduct((prev) => ({
            ...prev,
            developers: [...prev.developers, ""],
          }));
        }}
      >
        <AddIcon /> Add developer
      </Button>
    </>
  );
};
