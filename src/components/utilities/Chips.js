import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: "10px",
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5)
    }
  }
}));

export default function Chips(props) {
  const classes = useStyles();
  const { selectedTags, justify } = props;
  const [, setChipData] = React.useState(selectedTags);

  const handleDelete = chipToDelete => () => {
    setChipData(chips => chips.filter(chip => chip !== chipToDelete));
    props.parentCallback(chipToDelete);
  };

  return selectedTags ? (
    <div className={classes.root} style={{ justifyContent: justify }}>
      {selectedTags.map(data => {
        return (
          <Chip
            key={data}
            label={data}
            onDelete={handleDelete(data)}
            className={classes.chip}
            variant="outlined"
            color="secondary"
          />
        );
      })}
    </div>
  ) : (
    ""
  );
}
