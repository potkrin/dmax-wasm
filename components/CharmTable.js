import React, { useState, useEffect, useMemo } from "react";
import { Box, Button, Chip, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import { LDThemeContext } from "./LDThemeContext";
import ManualSyncButton from "./ManualSyncButton";
import DeleteIcon from "@mui/icons-material/Delete";

export function CharmTable({
  userCharmData,
  deleteUserCharms,
  fetchUserCharmData,
  handleOpenDeleteConfirmDialog,
  userCharmMetaData,
}) {
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
      newTableData.unshift(tempRow);
    }
    setTableData(newTableData);
  }, [userCharmData]);

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
            main: currentTheme.palette.info.main,
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
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        enableColumnFilters={false}
        enableMultiRowSelection
        enableSelectAll
        // sx={{
        //   "& .MuiBox-root css-wsew38": {
        //     display: "flex",
        //     flexDirection: "column",
        //   },
        // }}
        // muiToolbarDropZoneProps={{
        //   sx: { display: "flex", flexDirection: "column" },
        // }}
        // muiTopToolbarProps={{
        //   sx: { display: "flex", flexDirection: "column" },
        // }}
        muiSearchTextFieldProps={{
          // placeholder: "Search all users",
          sx: { maxWidth: "180px" },
          variant: "outlined",
        }}
        renderTopToolbarCustomActions={({ table }) => {
          const handleDelete = () => {
            // 削除対象のインデックスを作成
            const deleteTargetRows = [];
            const charmTotal = Object.keys(userCharmData).length;
            table.getSelectedRowModel().flatRows.map((row) => {
              deleteTargetRows.push(charmTotal - parseInt(row.id) - 1);
            });

            // 管理データから削除 (useEffect によりテーブルや localstorage にも反映される)
            handleOpenDeleteConfirmDialog(deleteTargetRows);
            table.resetRowSelection();
          };

          return (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <Button
                  color="secondary"
                  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                  onClick={handleDelete}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                >
                  削除
                </Button>
                {fetchUserCharmData && <ManualSyncButton fetchUserEquipData={fetchUserCharmData} />}
                {userCharmMetaData && (
                  <div>
                    <Tooltip title="最終更新日時とデータの更新回数" placement="top">
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                        color="text.secondary"
                      >
                        {new Date(userCharmMetaData.updated_at).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                        color="text.secondary"
                      >
                        ver.{userCharmMetaData.revision_number}
                      </Typography>
                    </Tooltip>
                  </div>
                )}
              </div>
            </>
          );
        }}
      />
    </ThemeProvider>
  );
}

export default CharmTable;
