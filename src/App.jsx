import { useState, useMemo } from "react";
import TabsNavigation from "./components/TabsNavigation";
import useCsvLoader from "./hooks/useCsvLoader";
import ReportTable from "./components/ReportTable";
import FilenameGrid from "./components/FilenameGrid";
import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import "./index.css";

const App = () => {
  const FOLDERS = {
    sales: ["people-1000.csv", "employees.csv"],
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
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>

        <TabsNavigation
          folders={Object.keys(FOLDERS)}
          activeFolder={activeFolder}
          onFolderChange={(folder) => {
            setActiveFolder(folder);
            setSelectedFile(null); // Reset selected file when folder changes
            setShowReportTable(false); // Reset to preview view
          }}
        />

        <Box sx={{ width: "100%" }}>
          <Typography variant="h5">
            {activeFolder.toUpperCase()} Reports
          </Typography>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ marginBottom: 2 }}>
              {error}
            </Alert>
          )}

          {!loading && !error && (
            <>
              {showReportTable ? (
                // Display ReportTable View
                <>
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<ArrowBack />}
                    onClick={() => setShowReportTable(false)}
                    sx={{ marginBottom: 2 }}
                  >
                    Back to File List
                  </Button>

                  {selectedFile && rows.length > 0 ? (
                    <ReportTable rows={rows} columns={columns} />
                  ) : (
                    <Typography variant="body1" sx={{ padding: 3 }}>
                      No data available for this report.
                    </Typography>
                  )}
                </>
              ) : (
                // Display FilenameGrid View
                <>
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
        </Box>
      </Box>
    </Container>
  );
};

export default App;
