import { useState, useEffect } from "react";
import Papa from "papaparse";

const useCsvLoader = (folder, filename) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log({ folder, filename });

  useEffect(() => {
    if (!filename) {
      setData([]);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/csv/${folder}/${filename}`);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch ${filename}: ${response.statusText}`
          );
        }
        const csvText = await response.text();
        const { data } = Papa.parse(csvText, { header: true });
        setData(data);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [folder, filename]);

  return { data, loading, error };
};

export default useCsvLoader;
