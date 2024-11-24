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
  const [showReportTable, setShowReportTable] = useState(false); // Track whether to show the table

  // Fetch CSV data for the selected file
  const { data, loading, error } = useCsvLoader(
    activeFolder,
    showReportTable ? selectedFile : null // Fetch only if a file is selected and table view is active
  );

  console.log({ activeFolder, selectedFile, data, showReportTable });

  // Prepare rows and columns for DataGrid
  const rows = useMemo(() => {
    if (data && selectedFile) {
      return data.map((row, id) => ({ id, ...row })); // Add unique IDs for DataGrid
    }
    return [];
  }, [data, selectedFile]);

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

  // Show the report table and set the selected file
  const handleFileClick = (filename) => {
    setSelectedFile(filename);
    setShowReportTable(true); // Switch to table view
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
          setShowReportTable(false); // Reset to preview view
        }}
      />
      <main>
        <h2>{activeFolder} Reports</h2>
        {loading && <p>Loading report...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <>
            {showReportTable ? (
              // Display ReportTable View
              <>
                <button
                  onClick={() => setShowReportTable(false)}
                  style={{
                    margin: "10px 0",
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Back to Reports
                </button>
                {selectedFile && rows.length > 0 ? (
                  <ReportTable rows={rows} columns={columns} />
                ) : (
                  <p>No data available for this report.</p>
                )}
              </>
            ) : (
              // Display FilenameGrid View
              <>
                <h3>Available Reports</h3>
                <FilenameGrid
                  filenames={FOLDERS[activeFolder]}
                  activeReports={activeReports}
                  onToggleActive={toggleReportStatus}
                  onFileClick={handleFileClick}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
