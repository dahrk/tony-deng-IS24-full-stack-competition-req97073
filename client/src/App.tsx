import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import { AppHeader } from "./components/AppHeader";
import { ProductModal } from "./components/ProductModal";
import { ProductRow } from "./components/ProductRow";
import { defaultProduct, handleFetchError } from "./utils";
import { Entry } from "./types";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [appData, setAppData] = useState<Entry[] | undefined>();
  const [filteredAppData, setFilteredAppData] = useState<Entry[] | undefined>();
  const [modalProduct, setModalProduct] = useState<Entry>({
    ...defaultProduct,
  });
  const [modalState, setModalState] = useState(false);
  const [dataFilter, setDataFilter] = useState("");

  const modalOpen = () => setModalState(true);
  const modalClose = () => {
    setModalProduct({ ...defaultProduct, developers: [""] });
    setModalState(false);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const data: Entry[] = await fetch("/api/product", {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          console.error("Response not OK");
        }
        return res.json();
      })
      .catch(handleFetchError);
    setAppData(data);
    setIsLoading(false);
  };

  // initial data loading
  useEffect(() => {
    fetchData();
  }, []);

  // filter logic
  useEffect(() => {
    if (dataFilter && appData) {
      setFilteredAppData(
        appData?.filter((v) =>
          (v.scrumMasterName + v.developers.join(" "))
            .toLowerCase()
            .includes(dataFilter.toLowerCase())
        )
      );
    }
  }, [appData, dataFilter]);

  const editCallback = (product: Entry) => {
    setModalProduct({ ...product, developers: [...product.developers] });
    modalOpen();
  };

  const deleteCallback = (productId: number) => {
    fetch(`/api/product/${productId}`, { method: "delete" })
      .then((res) => {
        if (!res.ok) {
          console.error("Response not ok");
        }
        fetchData();
      })
      .catch(handleFetchError);
  };

  const displayData = useMemo(
    () => (dataFilter ? filteredAppData : appData),
    [dataFilter, filteredAppData, appData]
  );

  return (
    <Container>
      <AppHeader
        dataFilter={dataFilter}
        displayData={displayData}
        modalOpen={modalOpen}
        setDataFilter={setDataFilter}
        setModalProduct={setModalProduct}
      />
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
      <ProductModal
        fetchData={fetchData}
        onClose={modalClose}
        open={modalState}
        product={modalProduct}
        setProduct={setModalProduct}
      />
    </Container>
  );
}

export default App;
