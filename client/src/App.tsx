import React, { useEffect, useState } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import { ProductRow } from "./ProductRow";
import { Entry } from "../../server/types";

function App() {
  const [appData, setAppData] = useState<Entry[] | undefined>();
  const [modalData, setModalData] = useState<Entry | undefined>();
  const [productModalOpen, setProductModalOpen] = useState(false);
  const modalOpen = () => setProductModalOpen(true);
  const modalClose = () => setProductModalOpen(false);

  const fetchData = async () => {
    const data: Entry[] = await fetch("/api/product", {
      method: "GET",
    }).then((res) => res.json());
    setAppData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const editCallback = (product: Entry) => {
    setModalData(product);
  };

  const deleteCallback = (productId: number) => {
    fetch(`/api/product/${productId}`, { method: "delete" }).then(() =>
      fetchData()
    );
  };

  return (
    <Container>
      <p>The total number of products is {appData?.length ?? 0}</p>
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
          {appData &&
            appData.map((entry) => (
              <ProductRow
                deleteCallback={() => deleteCallback(entry.productId)}
                editCallback={() => editCallback(entry)}
                entry={entry}
                key={entry.productId}
              />
            ))}
        </TableBody>
      </Table>
    </Container>
  );
}

export default App;
