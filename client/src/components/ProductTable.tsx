import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { ProductRow } from "./ProductRow";
import { Entry } from "../types";

type ProductTableProps = {
  deleteCallback: (productId: number) => void;
  displayData?: Entry[];
  editCallback: (product: Entry) => void;
  isLoading: boolean;
};

export const ProductTable = ({
  deleteCallback,
  displayData,
  editCallback,
  isLoading,
}: ProductTableProps) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Product Number</TableCell>
          <TableCell>Product Name</TableCell>
          <TableCell>Scrum Master</TableCell>
          <TableCell>Product Owner</TableCell>
          <TableCell>Developer(s)</TableCell>
          <TableCell>Start Date</TableCell>
          <TableCell>Methodology</TableCell>
          {/* Actions */}
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {displayData &&
          displayData.map((entry) => (
            <ProductRow
              deleteCallback={() => deleteCallback(entry.productId)}
              disabled={isLoading}
              editCallback={() => editCallback(entry)}
              entry={entry}
              key={entry.productId}
            />
          ))}
      </TableBody>
    </Table>
  );
};
