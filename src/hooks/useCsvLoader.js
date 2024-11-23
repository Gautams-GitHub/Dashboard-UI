import { useState, useEffect } from "react";
import { fetchAndParseCSV } from "../utils/csvUtils";

const useCsvLoader = (folder, filenames) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCSVFiles = async () => {
      console.log("FF");

      setLoading(true);
      setError(null);

      try {
        const fileData = await Promise.all(
          filenames.map(async (file) => ({
            file,
            data: await fetchAndParseCSV(folder, file),
          }))
        );

        // Transform fileData into an object keyed by filename
        const result = fileData.reduce((acc, { file, data }) => {
          acc[file] = data;
          return acc;
        }, {});
        setData(result);
      } catch (err) {
        setError("Failed to load CSV files");
      } finally {
        setLoading(false);
      }
    };
    loadCSVFiles();
  }, [folder, filenames]);

  return { data, loading, error };
};

export default useCsvLoader;
