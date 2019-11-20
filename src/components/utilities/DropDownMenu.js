import React from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(0)
  }
}));

function DropDownMenu(props) {
  const classes = useStyles();
  const { options, text } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const ITEM_HEIGHT = 48;
  if (options[0] !== text) options.unshift(text);

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = index => {
    if (text === "Choose Tag") setSelectedIndex(0);
    else setSelectedIndex(index);
    props.parentCallback(options[index]);
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        className={classes.button}
        aria-controls="menu-list-grow"
        aria-haspopup="true"
        onClick={handleClickListItem}
      >
        {options[selectedIndex]}
      </Button>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5
          }
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={() => handleMenuItemClick(index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default DropDownMenu;
