import { useState, useMemo } from "react";
import TabsNavigation from "./components/TabsNavigation";
import useCsvLoader from "./hooks/useCsvLoader";
import ReportTable from "./components/ReportTable";
import "./index.css";

const App = () => {
  const FOLDERS = {
    sales: ["people-1000.csv"],
    finance: ["organizations-1000.csv", "customers-1000.csv"],
  };
  const [activeFolder, setActiveFolder] = useState("sales");
  const [selectedFile, setSelectedFile] = useState(null);

  const filenames = useMemo(
    () => FOLDERS[activeFolder],
    [activeFolder, selectedFile]
  );

  const { data, loading, error } = useCsvLoader(activeFolder, filenames);

  // Prepare rows and columns for DataGrid
  const rows = useMemo(() => {
    if (selectedFile && data[selectedFile]) {
      return data[selectedFile].map((row, id) => ({ id, ...row })); // Add unique IDs for DataGrid
    }
    return [];
  }, [selectedFile, data]);

  const columns = useMemo(() => {
    if (rows.length > 0) {
      return Object.keys(rows[0]).map((key) => ({
        field: key,
        headerName: key,
        flex: 1,
      }));
    }
    return [];
  }, [rows]);

  return (
    <div className="app-container">
      <header>
        <h1>Dashboard</h1>
      </header>
      <TabsNavigation
        folders={Object.keys(FOLDERS)}
        activeFolder={activeFolder}
        onFolderChange={(folder) => {
          setActiveFolder(folder);
          setSelectedFile(null); // Reset selected file when folder changes
        }}
      />
      <main>
        <h2>{activeFolder} Reports</h2>
        {loading && <p>Loading reports...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            <div>
              <h3>Select a Report</h3>
              {filenames.map((filename) => (
                <button
                  key={filename}
                  onClick={() => setSelectedFile(filename)}
                  style={{
                    margin: "5px",
                    padding: "10px",
                    backgroundColor:
                      selectedFile === filename ? "#007bff" : "#f8f9fa",
                    color: selectedFile === filename ? "white" : "black",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  {filename}
                </button>
              ))}
            </div>
            {selectedFile && rows.length > 0 ? (
              <ReportTable rows={rows} columns={columns} />
            ) : (
              <p>Select a report to view its data.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
