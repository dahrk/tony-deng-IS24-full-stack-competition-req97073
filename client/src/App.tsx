import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";

import { Entry } from "../../server/types";

function App() {
  const [appData, setAppData] = useState<Entry[] | undefined>();

  const fetchData = async () => {
    const data: Entry[] = await fetch("/api/product", {
      method: "GET",
    }).then((res) => res.json());
    setAppData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container>
      <p>Hello world</p>
      {appData && appData[0].productId}
    </Container>
  );
}

export default App;
