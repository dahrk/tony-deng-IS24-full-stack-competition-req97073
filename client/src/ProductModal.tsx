import { Modal } from "@mui/material";
import React from "react";

type Props = {
  onClose: () => void;
  open: boolean;
};

export const ProductModal = ({ onClose, open }: Props) => {
  return (
    <Modal onClose={onClose} open={open}>
      <form
        onSubmit={() => {
          console.log("submit");
        }}
      ></form>
    </Modal>
  );
};
