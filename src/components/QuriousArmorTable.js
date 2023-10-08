import React, { useState, useEffect } from "react";

import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "name", headerName: "防具名", width: 320 },
  { field: "skills", headerName: "スキル", width: 320 },
  { field: "slots", headerName: "スロット", width: 160 },
];

export function QuriousArmorTable({ userQuriousArmorData }) {
  const [tableRows, setTableRows] = useState([]);

  const updateTableRowsFromQuriousArmorData = (quriousArmorData) => {
    const newRows = [];
    for (const [index, qarmor] of quriousArmorData.entries()) {
      const tempQuriousArmor = {
        id: index + 1,
        "name": qarmor["name"].replace(/ \(.*?\)/g, " "),
        "slots": qarmor["slots"].join("-"),
      };

      tempQuriousArmor["skills"] = "";
      for (const [skillName, skillValue] of Object.entries(qarmor["skills"])) {
        tempQuriousArmor["skills"] += skillName + skillValue + " ";
      }

      newRows.push(tempQuriousArmor);
    }
    setTableRows(newRows);
  };

  useEffect(() => {
    updateTableRowsFromQuriousArmorData(userQuriousArmorData);
  }, [userQuriousArmorData]);

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

export default QuriousArmorTable;
