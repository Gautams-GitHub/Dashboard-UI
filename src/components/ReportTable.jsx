/* eslint-disable react/prop-types */
import { useState, useMemo } from "react";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const ReportTable = ({ rows, columns }) => {
  const [taggedRows, setTaggedRows] = useState(rows || []); // Null check for rows
  const [groupBy, setGroupBy] = useState(null); // Current group-by field: "date" or "tag"
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentRowId, setCurrentRowId] = useState(null);
  const [newTag, setNewTag] = useState("");

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

  // Extend columns to include "tags" and "addTag"
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

  // Memoized grouped data
  const groupedData = useMemo(() => {
    if (!groupBy || !taggedRows) return { Ungrouped: taggedRows };

    return taggedRows.reduce((groups, row) => {
      const groupKey = groupBy === "tags" ? row.tags?.join(", ") : row.date;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(row);
      return groups;
    }, {});
  }, [groupBy, taggedRows]);

  return (
    <div style={{ width: "100%" }}>
      <div style={{ marginBottom: "16px" }}>
        <Button
          variant="contained"
          onClick={() => setGroupBy("tags")}
          style={{ marginRight: "8px" }}
        >
          Group by Tags
        </Button>
        <Button
          variant="contained"
          onClick={() => setGroupBy("date")}
          style={{ marginRight: "8px" }}
        >
          Group by Date
        </Button>
        <Button variant="outlined" onClick={() => setGroupBy(null)}>
          Clear Grouping
        </Button>
      </div>

      {/* Accordion for grouped data */}
      {Object.keys(groupedData).map((group) => (
        <Accordion key={group}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">{group || "Ungrouped"}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={groupedData[group]}
                columns={extendedColumns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
                getRowId={(row) => row.id || Math.random()} // Fallback for missing `id`
                components={{
                  Toolbar: () => (
                    <GridToolbarContainer>
                      <GridToolbarQuickFilter />
                      <GridToolbarExport />
                    </GridToolbarContainer>
                  ),
                }}
              />
            </div>
          </AccordionDetails>
        </Accordion>
      ))}

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
