import Papa from "papaparse";

// Fetch and parse a single CSV file
export const fetchAndParseCSV = async (folder, filename) => {
  try {
    const response = await fetch(`/csv/${folder}/${filename}`);
    if (!response.ok) throw new Error(`Failed to load ${filename}`);

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error(`Error loading CSV: ${error.message}`);
    return null;
  }
};

// Parse CSV text into JSON using PapaParse
export const parseCSV = (csvText) => {
  const parsedData = Papa.parse(csvText, {
    header: true, // Treat first row as column headers
    skipEmptyLines: true, // Ignore empty rows
  });
  return parsedData.data; // Returns an array of objects
};
