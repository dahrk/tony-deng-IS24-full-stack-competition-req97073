import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Box,
  Button,
  IconButton,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { ChangeEvent } from "react";

import { Entry } from "../../server/types";

type Props = {
  fetchData: () => Promise<void>;
  onClose: () => void;
  open: boolean;
  product: Entry;
  setProduct: React.Dispatch<React.SetStateAction<Entry>>;
};

export const ProductModal = ({
  fetchData,
  onClose,
  open,
  product,
  setProduct,
}: Props) => {
  const handleBasicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const textFieldProps = {
    fullWidth: true,
    onChange: handleBasicChange,
    required: true,
    sx: { display: "block", m: 2 },
    type: "text",
  };

  const isNew = product?.productId === -1;

  const createProduct = async () => {
    await fetch("/api/product", {
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
    }).then(() => fetchData());
  };

  const editProduct = async () => {
    await fetch(`/api/product/${product.productId}`, {
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
      method: "put",
    }).then(() => fetchData());
  };

  return (
    <Modal onClose={onClose} open={open}>
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <h3>{isNew ? "Add new product" : "Edit product"}</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await createProduct();
            onClose();
          }}
        >
          <Grid flexDirection="column">
            <TextField
              {...textFieldProps}
              id="productName"
              name="productName"
              label="Product Name"
              value={product?.productName}
            />
            <TextField
              {...textFieldProps}
              id="scrumMasterName"
              name="scrumMasterName"
              label="Scrum Master"
              value={product?.scrumMasterName}
            />
            <TextField
              {...textFieldProps}
              id="productOwnerName"
              name="productOwnerName"
              label="Product Owner"
              value={product?.productOwnerName}
            />
            {product?.developers.map((developer, i) => {
              return (
                <Box
                  key={`developer${i}`} // if two developers have the same name, this may throw an error. Can be addressed with some refactoring or the usage of developer id's
                  sx={{ display: "flex", flexDirection: "row", mx: 2, my: 1 }}
                >
                  <TextField
                    {...textFieldProps}
                    id={`developer${i}`}
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
                    disabled={product?.developers.length < 2}
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
              disabled={product?.developers.length > 4}
              onClick={() => {
                setProduct((prev) => ({
                  ...prev,
                  developers: [...prev.developers, ""],
                }));
              }}
            >
              <AddIcon /> Add developer
            </Button>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={dayjs(product?.startDate)}
                onChange={(v) => {
                  setProduct((prev) => ({
                    ...prev,
                    startDate:
                      v?.format("YYYY/MM/DD") ??
                      dayjs(new Date()).format("YYYY/MM/DD"),
                  }));
                }}
                sx={{ display: "block", m: 2 }}
              />
            </LocalizationProvider>
            <FormControl sx={{ display: "block", m: 2 }}>
              <FormLabel>Methodology</FormLabel>
              <RadioGroup
                defaultValue="Agile"
                name="methodology"
                value={product?.methodology}
                onChange={handleBasicChange}
              >
                <FormControlLabel
                  value="Agile"
                  control={<Radio />}
                  label="Agile"
                />
                <FormControlLabel
                  value="Waterfall"
                  control={<Radio />}
                  label="Waterfall"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
