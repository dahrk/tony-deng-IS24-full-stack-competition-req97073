import { Box, Button, FormLabel, Grid, Modal, TextField } from "@mui/material";
import dayjs from "dayjs";
import React, { ChangeEvent, useState } from "react";

import { ModalDateInput } from "./ModalDateInput";
import { ModalDynamicDevelopersInput } from "./ModalDynamicDevelopersInput";
import { ModalRadioInput } from "./ModalRadioInput";
import { handleFetchError } from "../../utils";
import { Entry } from "../../types";

type ProductModalProps = {
  fetchData: () => Promise<void>;
  onClose: () => void;
  open: boolean;
  product: Entry;
  setProduct: React.Dispatch<React.SetStateAction<Entry>>;
};

export const ProductModal = ({
  fetchData,
  onClose: onModalClose,
  open,
  product,
  setProduct,
}: ProductModalProps) => {
  const [dateInvalid, setDateInvalid] = useState(false);

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

  const createProductRequest = async () => {
    await fetch("/api/product", {
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Response not ok");
        }
        fetchData();
      })
      .catch(handleFetchError);
  };

  const editProductRequest = async () => {
    await fetch(`/api/product/${product.productId}`, {
      body: JSON.stringify(product),
      headers: {
        "Content-Type": "application/json",
      },
      method: "put",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Response not ok");
        }
        fetchData();
      })
      .catch(handleFetchError);
  };

  const onClose = () => {
    setDateInvalid(false);
    onModalClose();
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
            if (!dayjs(product?.startDate).isValid()) {
              setDateInvalid(true);
              return;
            }

            setDateInvalid(false);
            await (isNew ? createProductRequest() : editProductRequest());
            onClose();
          }}
        >
          <Grid flexDirection="column">
            <TextField
              {...textFieldProps}
              name="productName"
              label="Product Name"
              value={product?.productName}
            />
            <TextField
              {...textFieldProps}
              name="scrumMasterName"
              label="Scrum Master"
              value={product?.scrumMasterName}
            />
            <TextField
              {...textFieldProps}
              name="productOwnerName"
              label="Product Owner"
              value={product?.productOwnerName}
            />
            <ModalDynamicDevelopersInput
              developers={product?.developers}
              setProduct={setProduct}
              textFieldProps={textFieldProps}
            />
            <ModalDateInput setValue={setProduct} value={product?.startDate} />
            {dateInvalid && (
              <FormLabel sx={{ color: "crimson", m: 2 }}>
                Please enter a valid date
              </FormLabel>
            )}
            <ModalRadioInput
              onChange={handleBasicChange}
              value={product?.methodology}
            />
          </Grid>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </form>
      </Box>
    </Modal>
  );
};
