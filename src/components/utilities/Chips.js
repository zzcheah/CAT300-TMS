import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: "50px",
    display: "flex",
    justifyContent: "left",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  }
}));

export default function Chips() {
  const classes = useStyles();
  const [chipData, setChipData] = React.useState([
    { key: 0, label: "Angular" },
    { key: 1, label: "jQuery" },
    { key: 2, label: "Polymer" },
    { key: 3, label: "React" },
    { key: 4, label: "Vue.js" }
  ]);
  const [selectedKeys, setSelectedKeys] = React.useState([]);

  const handleDelete = chipToDelete => () => {
    setChipData(chips => chips.filter(chip => chip.key !== chipToDelete.key));
  };

  const handleClick = chip => {
    if (selectedKeys.includes(chip.key))
      setSelectedKeys(oldArr => oldArr.filter(key => key !== chip.key));
    else setSelectedKeys(oldArr => [...oldArr, chip.key]);
  };

  return (
    <div className={classes.root}>
      {chipData.map(data => {
        return (
          <Chip
            key={data.key}
            label={data.label}
            onDelete={handleDelete(data)}
            onClick={() => handleClick(data)}
            className={classes.chip}
            variant={selectedKeys.includes(data.key) ? "default" : "outlined"}
            color="secondary"
            // variant="outlined"
            // color={selectedKeys.includes(data.key) ? "primary" : "secondary"}
          />
        );
      })}
    </div>
  );
}
