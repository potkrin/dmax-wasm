import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";

export function CharmTable({ userCharmData, deleteUserCharms }) {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "firstSkill",
        header: "第一スキル",
        size: 150,
      },
      {
        accessorKey: "secondSkill",
        header: "第二スキル",
        size: 150,
      },
      {
        accessorKey: "slots",
        header: "スロット",
        size: 200,
      },
    ],
    []
  );

  // テーブル表示用データ
  const [tableData, setTableData] = useState([]);

  // userCharmData が変更されたらテーブル表示用データを更新
  useEffect(() => {
    const newTableData = [];
    for (const charm of userCharmData) {
      const tempRow = {
        "slots": charm.slots.join("-"),
      };
      const skillList = Object.entries(charm.skills);
      tempRow["firstSkill"] = skillList[0] ? skillList[0][0] + "Lv" + skillList[0][1] : "";
      tempRow["secondSkill"] = skillList[1] ? skillList[1][0] + "Lv" + skillList[1][1] : "";
      newTableData.push(tempRow);
    }
    setTableData(newTableData);
  }, [userCharmData]);

  return (
    <MaterialReactTable
      columns={columns}
      data={tableData}
      enablePagination={false}
      enableRowSelection
      enableMultiRowSelection
      enableSelectAll
      renderTopToolbarCustomActions={({ table }) => {
        const handleDelete = () => {
          // 削除対象のインデックスを作成
          const deleteTargetRows = [];
          table.getSelectedRowModel().flatRows.map((row) => {
            deleteTargetRows.push(parseInt(row.id));
          });

          // 管理データから削除 (useEffect によりテーブルや localstorage にも反映される)
          deleteUserCharms(deleteTargetRows);
          table.resetRowSelection();
        };

        return (
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Button
              color="secondary"
              disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
              onClick={handleDelete}
              variant="contained"
            >
              削除
            </Button>
          </div>
        );
      }}
    />
  );
}

export default CharmTable;
