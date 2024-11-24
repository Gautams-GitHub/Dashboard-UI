import { useState, useMemo } from "react";
import TabsNavigation from "./components/TabsNavigation";
import useCsvLoader from "./hooks/useCsvLoader";
import ReportTable from "./components/ReportTable";
import FilenameGrid from "./components/FilenameGrid";
import "./index.css";

const App = () => {
  const FOLDERS = {
    sales: ["people-1000.csv"],
    finance: ["organizations-1000.csv", "customers-1000.csv"],
  };
  const [activeFolder, setActiveFolder] = useState("sales");
  const [selectedFile, setSelectedFile] = useState(null);
  const [activeReports, setActiveReports] = useState([]); // Track active reports

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

  // Toggle report status (Active/Inactive)
  const toggleReportStatus = (filename) => {
    setActiveReports(
      (prevActive) =>
        prevActive.includes(filename)
          ? prevActive.filter((report) => report !== filename) // Remove if active
          : [...prevActive, filename] // Add if inactive
    );
  };

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
            <div style={{ marginBottom: 8 }}>
              <h3>Available Reports</h3>
              <FilenameGrid
                filenames={filenames}
                activeReports={activeReports}
                onToggleActive={toggleReportStatus} // Toggle active/inactive
                onFileClick={(filename) => setSelectedFile(filename)} // Set selected file
              />
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
