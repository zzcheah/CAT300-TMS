import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

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

export default function Chips(props) {
  const classes = useStyles();
  const { selectedTags } = props;
  const [chipData, setChipData] = React.useState(selectedTags);

  const handleDelete = chipToDelete => () => {
    setChipData(chips => chips.filter(chip => chip !== chipToDelete));
    props.parentCallback(chipToDelete);
  };

  return (
    <div className={classes.root}>
      {selectedTags.map(data => {
        return (
          <Chip
            label={data}
            onDelete={handleDelete(data)}
            className={classes.chip}
            variant="outlined"
            color="secondary"
          />
        );
      })}
    </div>
  );
}
