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

function createData(name, vector) {
  return { name, vector };
}

export default function FeatureMatrix(props) {
  const classes = useStyles();
  const { organizers, tags, users, trainings } = props;
  // const numFeature = tags.length + organizers.length;

  const trainingRows = [];

  const userRows = [];

  trainings.map(training => {
    const vector = [];
    for (var i = 0; i < tags.length; i++) {
      if (training.selectedTags.includes(tags[i])) vector.push(true);
      else vector.push(false);
    }
    for (i = 0; i < organizers.length; i++) {
      if (training.organizer.includes(organizers[i])) vector.push(true);
      else vector.push(false);
    }
    trainingRows.push(createData(training.title, vector));
    // console.log(trainingRows);
  });

  users.map(user => {
    const vector = [];
    for (var i = 0; i < tags.length; i++) {
      if (user.tags.includes(tags[i])) vector.push(true);
      else vector.push(false);
    }
    for (i = 0; i < organizers.length; i++) {
      if (user.tags.includes(organizers[i])) vector.push(true);
      else vector.push(false);
    }
    userRows.push(createData(user.firstName, vector));
    // console.log(userRows);
  });

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
                <TableCell align="center">{tag}</TableCell>
              ))}
              {organizers.map(organizer => (
                <TableCell align="center">{organizer}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {trainingRows.map(trainingRow => {
              return (
                <TableRow key={trainingRow.name}>
                  <TableCell component="th" scope="row">
                    {trainingRow.name}
                  </TableCell>
                  {trainingRow.vector.map(vec => (
                    <TableCell align="center">
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
              {userRows[0].vector.map(() => (
                <TableCell align="center"></TableCell>
              ))}
            </TableRow>
            {userRows.map(userRow => {
              return (
                <TableRow key={userRow.name}>
                  <TableCell component="th" scope="row">
                    {userRow.name}
                  </TableCell>
                  {userRow.vector.map(vec => (
                    <TableCell align="center">
                      {vec ? <span>&#x2714;</span> : ""}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
            {/* {rows.map(row => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="center">
                  {row.calories ? <span>&#8226;</span> : ""}
                </TableCell>
                <TableCell align="center">{row.fat}</TableCell>
                <TableCell align="center">{row.carbs}</TableCell>
                <TableCell align="center">{row.protein}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
