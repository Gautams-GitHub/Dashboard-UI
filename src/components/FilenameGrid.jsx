/* eslint-disable react/prop-types */

import { DataGrid } from "@mui/x-data-grid";
import { Switch } from "@mui/material";
const FilenameGrid = ({
  filenames,
  activeReports,
  onToggleActive,
  onFileClick,
}) => {
  // Prepare rows for DataGrid
  const rows = filenames.map((filename, id) => ({
    id,
    filename,
    active: activeReports.includes(filename),
  }));

  // Define columns for DataGrid
  const columns = [
    {
      field: "filename",
      headerName: "Filename",
      flex: 1,
      renderCell: (params) => (
        <button
          style={{
            background: "none",
            color: "#007bff",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
            padding: 0,
          }}
          onClick={() => onFileClick(params.value)}
        >
          {params.value}
        </button>
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
    <div style={{ height: 400, width: "100%" }}>
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
