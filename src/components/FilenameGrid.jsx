/* eslint-disable react/prop-types */
import { DataGrid } from "@mui/x-data-grid";
import { Switch } from "@mui/material";

/* Props:
 - filenames: Array of filenames to display.
 - activeReports: Array of active report filenames.
 - onToggleActive: Function to toggle active state.
 - onFileClick: Function triggered when a filename is clicked.
*/
const FilenameGrid = ({
  filenames,
  activeReports,
  onToggleActive,
  onFileClick,
}) => {
  // Create rows from filenames
  const rows = filenames.map((filename, id) => ({
    id,
    filename,
    active: activeReports.includes(filename),
  }));

  // Define columns for the DataGrid
  const columns = [
    {
      field: "filename",
      headerName: "Filename",
      flex: 2,
      renderCell: (params) => (
        <span
          onClick={() => onFileClick(params.row.filename)}
          style={{
            color: "#007bff",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {params.row.filename}
        </span>
      ),
    },
    {
      field: "active",
      headerName: "Active",
      flex: 1,
      renderCell: (params) => (
        <Switch
          checked={params.row.active}
          onChange={() => onToggleActive(params.row.filename)}
          color="primary"
        />
      ),
    },
  ];

  return (
    <div style={{ height: 300, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default FilenameGrid;
