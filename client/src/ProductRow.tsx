import { IconButton, TableCell, TableRow } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import React from "react";

import { Entry } from "../../server/types";

type Props = {
  deleteCallback: () => void;
  editCallback: () => void;
  entry: Entry;
};

export const ProductRow = ({ deleteCallback, editCallback, entry }: Props) => {
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
        <IconButton onClick={editCallback}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={deleteCallback}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};
