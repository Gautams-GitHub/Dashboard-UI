/* eslint-disable react/prop-types */
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const ReportTable = ({ rows, columns }) => {
  const [taggedRows, setTaggedRows] = useState(rows || []); // Null check for rows
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [newTag, setNewTag] = useState("");

  console.log(taggedRows);

  // Add a new tag to the selected row
  const handleAddTag = () => {
    setTaggedRows((prevRows) =>
      prevRows.map((row) =>
        row.id === currentRowId
          ? { ...row, tags: [...(row.tags || []), newTag] }
          : row
      )
    );
    setNewTag("");
    setDialogOpen(false);
  };

  // Open the tag editor dialog for a specific row
  const openTagEditor = (rowId) => {
    setCurrentRowId(rowId);
    setDialogOpen(true);
  };

  // Ensure columns are properly handled with tags and add-tag functionality
  const extendedColumns = [
    ...(columns || []), // Null check for columns
    {
      field: "tags",
      headerName: "Tags",
      flex: 1,
      renderCell: (params) => {
        return <div>{params?.row?.tags ? params.row.tags.join(", ") : ""}</div>;
      },
    },
    {
      field: "addTag",
      headerName: "Add Tag",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Button
          key={params?.row?.id} // Ensure unique key for button
          variant="contained"
          size="small"
          onClick={() => openTagEditor(params.row.id)}
        >
          Add Tag
        </Button>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={taggedRows}
        columns={extendedColumns}
        pageSize={20}
        rowsPerPageOptions={[20, 50, 100, 1000]}
        onPageSizeChange={(newPageSize) => console.log(newPageSize)} // Placeholder
        sortingOrder={["asc", "desc"]}
        disableSelectionOnClick
        getRowId={(row) => row.id || Math.random()} // Fallback for missing `id`
      />

      {/* Add Tag Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="add-tag-dialog"
      >
        <DialogTitle id="add-tag-dialog">Add Tag</DialogTitle>
        <DialogContent>
          <TextField
            id="tag-input"
            label="New Tag"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddTag}
            disabled={!newTag.trim()} // Prevent empty tags
            variant="contained"
          >
            Add Tag
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ReportTable;
