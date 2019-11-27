import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  paper: {
    marginTop: theme.spacing(3),
    width: "100%",
    overflowX: "auto",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 650
  }
}));

export default function FeatureMatrix(props) {
  const classes = useStyles();
  const { organizers, tags, userRows, trainingRows } = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Features </TableCell>
              {tags.map(tag => (
                <TableCell key={tag.id} align="center">
                  {tag.type}
                </TableCell>
              ))}
              {organizers.map(organizer => (
                <TableCell key={organizer.id} align="center">
                  {organizer.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {trainingRows.map(trainingRow => {
              return (
                <TableRow key={trainingRow.id}>
                  <TableCell component="th" scope="row">
                    {trainingRow.name}
                  </TableCell>
                  {trainingRow.vector.map((vec, index) => (
                    <TableCell key={index} align="center">
                      {vec ? <span>&#x2714;</span> : ""}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            <TableRow key="emptyRow">
              <TableCell component="th" scope="row">
                Users
              </TableCell>
              {userRows[0].vector.map((val, index) => (
                <TableCell key={index} align="center"></TableCell>
              ))}
            </TableRow>
            {userRows.map(userRow => {
              return (
                <TableRow key={userRow.id}>
                  <TableCell component="th" scope="row">
                    {userRow.name}
                  </TableCell>
                  {userRow.vector.map((vec, index) => (
                    <TableCell key={index} align="center">
                      {vec ? <span>&#x2714;</span> : ""}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
