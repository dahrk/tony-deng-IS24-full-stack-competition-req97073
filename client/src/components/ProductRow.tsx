import { IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

import { Entry } from "../types";

type ProductRowProps = {
  deleteCallback: () => void;
  disabled: boolean;
  editCallback: () => void;
  entry: Entry;
};

export const ProductRow = ({
  deleteCallback,
  disabled,
  editCallback,
  entry,
}: ProductRowProps) => {
  return (
    <TableRow key={entry.productId}>
      <TableCell>{entry.productId}</TableCell>
      <TableCell>{entry.productName}</TableCell>
      <TableCell>{entry.scrumMasterName}</TableCell>
      <TableCell>{entry.productOwnerName}</TableCell>
      <TableCell>
        {entry.developers.map((name) => (
          <p key={name}>{name}</p>
        ))}
      </TableCell>
      <TableCell>{entry.startDate}</TableCell>
      <TableCell>{entry.methodology}</TableCell>
      <TableCell>
        <IconButton disabled={disabled} onClick={editCallback}>
          <EditIcon />
        </IconButton>
        <IconButton disabled={disabled} onClick={deleteCallback}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
