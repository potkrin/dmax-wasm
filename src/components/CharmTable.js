import React, { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "1stSkillName", headerName: "スキル", width: 160 },
  { field: "1stSkillLevel", headerName: "レベル", width: 80 },
  { field: "2ndSkillName", headerName: "スキル", width: 160 },
  { field: "2ndSkillLevel", headerName: "レベル", width: 80 },
  { field: "slots", headerName: "スロット", width: 160 },
];

export function CharmTable({ userCharmData }) {
  const [tableRows, setTableRows] = useState([]);

  const updateTableRowsFromCharmData = (charmData) => {
    const newRows = [];
    for (const [index, charm] of charmData.entries()) {
      newRows.push({
        id: index + 1,
        "1stSkillName": Object.keys(charm["skills"])[0],
        "2ndSkillName": Object.keys(charm["skills"])[1],
        "1stSkillLevel":
          Object.keys(charm["skills"])[0] !== "" ? "Lv" + Object.values(charm["skills"])[0] : "",
        "2ndSkillLevel":
          Object.keys(charm["skills"])[1] !== "" ? "Lv" + Object.values(charm["skills"])[1] : "",
        "slots": charm["slots"].join("-"),
      });
    }
    setTableRows(newRows);
  };

  useEffect(() => {
    updateTableRowsFromCharmData(userCharmData);
  }, [userCharmData]);

  return (
    <>
      <div style={{ width: "100%" }}>
        <DataGrid
          rows={tableRows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 100 },
            },
          }}
          pageSizeOptions={[5, 25, 100]}
          checkboxSelection
        />
      </div>
    </>
  );
}

export default CharmTable;
