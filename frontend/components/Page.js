import { useState, useEffect } from "react";
import { ScrapeContextProvider } from "./ScrapeContext";

//Custom Hook for fetching scrapes from database
function useScrapes() {
  const [scrapes, setScrapes] = useState([]);

  async function getScrapes() {
    const res = await fetch("http://localhost:2094/data");
    const data = await res.json();
    setScrapes(data);
  }

  useEffect(() => {
    getScrapes();
  }, []);

  return scrapes;
}

export default function Page({ children }) {
  const scrapes = useScrapes();

  return (
    <ScrapeContextProvider value={scrapes}>
      <div className="page">{children}</div>
    </ScrapeContextProvider>
  );
}
