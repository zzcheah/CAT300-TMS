import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

function createData(name, vector) {
  var temp = { name };
  vector.map((element, index) => {
    temp = { ...temp, [index]: element };
  });
  return temp;
}

const useStyles = makeStyles({
  root: {
    width: "100%"
  },
  tableWrapper: {
    maxHeight: 450,
    overflow: "auto"
  }
});

export default function StickyHeadTable(props) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const { organizers, tags, xRows, head } = props;
  const [rowsPerPage, setRowsPerPage] = React.useState(
    head === "Training" ? 5 : 1
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const rows = [];
  xRows.forEach(row => {
    rows.push(createData(row.name, row.vector));
  });

  const columns = [{ id: head, label: head, minWidth: 150 }];

  //   const numFeatures = tags.length + organizers.length;
  //   console.log(numFeatures);
  for (var i = 0; i < tags.length; i++) {
    columns.push({ id: i, label: tags[i].type, minWidth: 70 });
  }
  for (var j = 0; j < organizers.length; j++) {
    columns.push({
      id: j + tags.length,
      label: organizers[j].name,
      minWidth: 150
    });
  }

  return (
    <Paper className={classes.root}>
      <div className={classes.tableWrapper}>
        <Table stickyHeader aria-label="sticky table" size="small">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align={"center"}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "lightblue"
                    // borderColor: "grey"
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      if (column.id === head)
                        return (
                          <TableCell key={column.id} align={"left"}>
                            {row.name}
                          </TableCell>
                        );
                      return (
                        <TableCell key={column.id} align={"center"}>
                          {value ? <span>&#x2714;</span> : ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        rowsPerPageOptions={[1, 2, 5, 10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
