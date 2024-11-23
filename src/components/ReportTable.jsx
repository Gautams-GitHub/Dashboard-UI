/* eslint-disable react/prop-types */
import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const ReportTable = ({ rows, columns }) => {
  const [pageSize, setPageSize] = useState(20);

  return (
    <div style={{ height: 500, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[20, 50, 100, 1000]}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        sortingOrder={["asc", "desc"]}
        disableSelectionOnClick
      />
    </div>
  );
};

export default ReportTable;
