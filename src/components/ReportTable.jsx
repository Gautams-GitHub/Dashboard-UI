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
  Box,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Add from "@mui/icons-material/Add";
import Close from "@mui/icons-material/Close";

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
      headerName: "Tag",
      flex: 2,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <div>{params?.row?.tags ? params.row.tags.join(", ") : ""}</div>
            {params?.row?.tags?.length ? (
              <IconButton>
                <Close
                  key={params?.row?.id}
                  sx={{ px: 0 }}
                  onClick={() => {
                    setCurrentRowId(params.row.id);
                    setTaggedRows((prevRows) =>
                      prevRows.map((row) =>
                        row.id === params.row.id ? { ...row, tags: [""] } : row
                      )
                    );
                  }}
                />
              </IconButton>
            ) : (
              <Button
                key={params?.row?.id} // Ensure unique key for button
                variant="contained"
                size="small"
                onClick={() => openTagEditor(params.row.id)}
                sx={{ px: 0 }}
              >
                <Add sx={{ px: 0 }} />
              </Button>
            )}
          </Box>
        );
      },
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

  console.log({ groupedData });

  return (
    <Box sx={{ width: "100%", padding: 2 }}>
      {/* Grouping buttons */}
      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setGroupBy("tags")}
          sx={{ marginRight: 1 }}
        >
          Group by Tags
        </Button>
        <Button variant="outlined" onClick={() => setGroupBy(null)}>
          Clear Grouping
        </Button>
      </Box>

      {/* Accordion for grouped data */}
      {}
      {Object.keys(groupedData).map((group) => {
        if (group == "undefined") {
          if (Object.keys(groupedData).length > 1) {
            return;
          }
          return <>No such data is available.</>;
        }
        return (
          <Accordion key={group}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{group || "Ungrouped"}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ height: 400, width: "100%" }}>
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
              </Box>
            </AccordionDetails>
          </Accordion>
        );
      })}

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
            sx={{ marginTop: 2 }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddTag}
            disabled={!newTag.trim()} // Prevent empty tags
            variant="contained"
            color="primary"
          >
            Add Tag
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportTable;
