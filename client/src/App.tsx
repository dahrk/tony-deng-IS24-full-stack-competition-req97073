import { Container } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import { AppHeader } from "./components/AppHeader";
import { ProductModal } from "./components/ProductModal";
import { ProductTable } from "./components/ProductTable";
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

  // fetch all data from endpoint and populate it in memory
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

  // sets the modalProduct before opening the shared modal
  const editCallback = (product: Entry) => {
    setModalProduct({ ...product, developers: [...product.developers] });
    modalOpen();
  };

  // calls the delete api path
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

  // memoized version of two local appDatas, original is not modified to reduce extraenous requests
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
      <ProductTable
        deleteCallback={deleteCallback}
        displayData={displayData}
        editCallback={editCallback}
        isLoading={isLoading}
      />
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
