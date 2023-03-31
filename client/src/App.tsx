import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";

import { ProductModal } from "./ProductModal";
import { ProductRow } from "./ProductRow";
import { Entry } from "../../server/types";

const defaultProduct: Entry = {
  productId: -1,
  productName: "",
  productOwnerName: "",
  developers: [""],
  scrumMasterName: "",
  startDate: dayjs(new Date()).format("YYYY/MM/DD"),
  methodology: "Agile",
};

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [appData, setAppData] = useState<Entry[] | undefined>();
  const [filteredAppData, setFilteredAppData] = useState<Entry[] | undefined>();
  const [modalProduct, setModalProduct] = useState<Entry>({
    ...defaultProduct,
  });
  const [modalState, setModalState] = useState(false);
  const [dataFilter, setDataFilter] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    const data: Entry[] = await fetch("/api/product", {
      method: "GET",
    }).then((res) => res.json());
    setAppData(data);
    setIsLoading(false);
  };

  // initial data loading
  useEffect(() => {
    fetchData();
  }, []);

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

  const modalOpen = () => setModalState(true);
  const modalClose = () => {
    setModalProduct({ ...defaultProduct, developers: [""] });
    setModalState(false);
  };

  const editCallback = (product: Entry) => {
    setModalProduct({ ...product, developers: [...product.developers] });
    modalOpen();
  };

  const deleteCallback = (productId: number) => {
    fetch(`/api/product/${productId}`, { method: "delete" }).then(() =>
      fetchData()
    );
  };

  return (
    <>
      <Container>
        <Grid container flexDirection="column" width="500px">
          <Grid item>
            <p>The total number of products is {appData?.length ?? 0}</p>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                setModalProduct(defaultProduct);
                modalOpen();
              }}
            >
              <AddIcon /> Add new product
            </Button>
          </Grid>
          <Grid item>
            <TextField
              id="filter"
              inputProps={{ sx: { width: "500px" } }}
              label="Scrum Master and Developer Search"
              name="filter"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setDataFilter(e.target.value);
              }}
              value={dataFilter}
            />
          </Grid>
        </Grid>
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
            {(function () {
              const dataToUse = dataFilter ? filteredAppData : appData;
              return (
                dataToUse &&
                dataToUse.map((entry) => (
                  <ProductRow
                    deleteCallback={() => deleteCallback(entry.productId)}
                    disabled={isLoading}
                    editCallback={() => editCallback(entry)}
                    entry={entry}
                    key={entry.productId}
                  />
                ))
              );
            })()}
          </TableBody>
        </Table>
      </Container>
      <ProductModal
        fetchData={fetchData}
        onClose={modalClose}
        open={modalState}
        product={modalProduct}
        setProduct={setModalProduct}
      />
    </>
  );
}

export default App;
