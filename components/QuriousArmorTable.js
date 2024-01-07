import React, { useState, useEffect, useMemo } from "react";
import { Button, ThemeProvider, createTheme, Tooltip, Typography } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { LDThemeContext } from "./LDThemeContext";
import ManualSyncButton from "./ManualSyncButton";
import DeleteIcon from "@mui/icons-material/Delete";

export function QuriousArmorTable({
  userQuriousArmorData,
  deleteUserQuriousArmors,
  fetchUserQuriousArmorData,
  handleOpenDeleteConfirmDialog,
  userQuriousArmorMetaData,
}) {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "armorName",
        header: "防具名",
        // size: 150,
      },
      {
        accessorKey: "skills",
        header: "スキル",
        // size: 250,
      },
      {
        accessorKey: "slots",
        header: "スロット",
        // size: 100,
      },
    ],
    []
  );

  // テーブル表示用データ
  const [tableData, setTableData] = useState([]);

  // userQuriousArmorData が変更されたらテーブル表示用データを更新
  useEffect(() => {
    const newTableData = [];
    for (const quriousArmor of userQuriousArmorData) {
      const tempRow = {
        "slots": quriousArmor.slots.join("-"),
      };
      tempRow["armorName"] = quriousArmor.originalArmorName;
      const skillList = Object.entries(quriousArmor.skills);

      tempRow["skills"] = "";
      for (const [skillName, skillLevel] of skillList) {
        tempRow["skills"] += skillName + "Lv" + skillLevel + " ";
      }
      newTableData.unshift(tempRow);
    }
    setTableData(newTableData);
  }, [userQuriousArmorData]);

  const { currentTheme, toggleTheme } = React.useContext(LDThemeContext);

  // from: https://v1.material-react-table.com/docs/guides/customize-components
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: currentTheme.palette.mode, //let's use the same dark/light mode as the current theme
          primary: currentTheme.palette.primary, //swap in the secondary color as the primary for the table
          secondary: currentTheme.palette.secondary, //swap in the primary color as the secondary for the table
          info: {
            main: "rgb(255,122,0)", //add in a custom color for the toolbar alert background stuff
          },
          background: {
            default: currentTheme.palette.background.paper,
          },
        },
        typography: {
          button: {
            textTransform: "none", //customize typography styles for all buttons in table by default
            fontSize: "14px",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem", //override to make tooltip font size larger
              },
            },
          },
        },
      }),
    [currentTheme]
  );

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        enablePagination={false}
        enableRowSelection
        enableMultiRowSelection
        enableSelectAll
        enableColumnResizing
        renderTopToolbarCustomActions={({ table }) => {
          const handleDelete = () => {
            // 削除対象のインデックスを作成
            const deleteTargetRows = [];
            const quriousArmorTotal = Object.keys(userQuriousArmorData).length;
            table.getSelectedRowModel().flatRows.map((row) => {
              deleteTargetRows.push(quriousArmorTotal - parseInt(row.id) - 1);
            });

            // 管理データから削除 (useEffect によりテーブルや localstorage にも反映される)
            handleOpenDeleteConfirmDialog(deleteTargetRows);
            table.resetRowSelection();
          };

          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                color="secondary"
                disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                onClick={handleDelete}
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                削除
              </Button>
              {fetchUserQuriousArmorData && (
                <ManualSyncButton fetchUserEquipData={fetchUserQuriousArmorData} />
              )}
              {userQuriousArmorMetaData && (
                <div>
                  <Tooltip title="最終更新日時とデータの更新回数" placement="top">
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                      color="text.secondary"
                    >
                      {new Date(userQuriousArmorMetaData.updated_at).toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      component="div"
                      sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                      color="text.secondary"
                    >
                      ver.{userQuriousArmorMetaData.revision_number}
                    </Typography>
                  </Tooltip>
                </div>
              )}
            </div>
          );
        }}
      />
    </ThemeProvider>
  );
}

export default QuriousArmorTable;

// import React, { useState, useEffect } from "react";

// import { DataGrid } from "@mui/x-data-grid";

// const columns = [
//   { field: "name", headerName: "防具名", width: 320 },
//   { field: "skills", headerName: "スキル", width: 320 },
//   { field: "slots", headerName: "スロット", width: 160 },
// ];

// export function QuriousArmorTable({ userQuriousArmorData }) {
//   const [tableRows, setTableRows] = useState([]);

//   const updateTableRowsFromQuriousArmorData = (quriousArmorData) => {
//     const newRows = [];
//     for (const [index, qarmor] of quriousArmorData.entries()) {
//       const tempQuriousArmor = {
//         id: index + 1,
//         "name": qarmor["name"].replace(/ \(.*?\)/g, " "),
//         "slots": qarmor["slots"].join("-"),
//       };

//       tempQuriousArmor["skills"] = "";
//       for (const [skillName, skillValue] of Object.entries(qarmor["skills"])) {
//         tempQuriousArmor["skills"] += skillName + skillValue + " ";
//       }

//       newRows.push(tempQuriousArmor);
//     }
//     setTableRows(newRows);
//   };

//   useEffect(() => {
//     updateTableRowsFromQuriousArmorData(userQuriousArmorData);
//   }, [userQuriousArmorData]);

//   return (
//     <>
//       <div style={{ width: "100%" }}>
//         <DataGrid
//           rows={tableRows}
//           columns={columns}
//           initialState={{
//             pagination: {
//               paginationModel: { page: 0, pageSize: 100 },
//             },
//           }}
//           pageSizeOptions={[5, 25, 100]}
//           checkboxSelection
//         />
//       </div>
//     </>
//   );
// }

// export default QuriousArmorTable;
