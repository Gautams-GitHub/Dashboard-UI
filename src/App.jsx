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
            <div>
              <h3>Toggle Report Status</h3>
              {filenames.map((filename) => (
                <button
                  key={`toggle-${filename}`}
                  onClick={() => toggleReportStatus(filename)}
                  style={{
                    margin: "5px",
                    padding: "10px",
                    backgroundColor: activeReports.includes(filename)
                      ? "green"
                      : "red",
                    color: "white",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                  }}
                >
                  {activeReports.includes(filename) ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
            <div>
              <h3>Active Reports</h3>
              {activeReports.length > 0 ? (
                <ul>
                  {activeReports.map((report) => (
                    <li key={`active-${report}`}>{report}</li>
                  ))}
                </ul>
              ) : (
                <p>No Active Reports</p>
              )}
            </div>
            <div>
              <h3>Inactive Reports</h3>
              {filenames
                .filter((filename) => !activeReports.includes(filename))
                .map((inactiveReport) => (
                  <p key={`inactive-${inactiveReport}`}>{inactiveReport}</p>
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
