import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import IconButton from "@material-ui/core/IconButton";

import MenuItem from "@material-ui/core/MenuItem";

import AccountCircle from "@material-ui/icons/AccountCircle";

import { connect } from "react-redux";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import { Link } from "react-router-dom";
import { signOut } from "../../store/actions/authAction";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
    // zIndex: 50
  },
  paper: {
    marginRight: theme.spacing(2)
    // zIndex: 0
  },
  grow: {
    flexGrow: 1
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex"
    }
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none"
    }
  },
  logo: {
    display: "block",
    width: "auto",
    height: 38,
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(1)
  }
}));

// export default function Notification() {
const Profile = props => {
  //   console.log(props);
  const { auth, test } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const renderProfileSubmenu = (
    <Popper
      open={open}
      anchorEl={anchorRef.current}
      role={undefined}
      transition
      // disablePortal
    >
      {({ TransitionProps, placement }) => (
        <Grow
          {...TransitionProps}
          style={{
            transformOrigin:
              placement === "bottom" ? "center top" : "center bottom"
          }}
        >
          <Paper>
            <ClickAwayListener onClickAway={handleClose}>
              <MenuList
                autoFocusItem={open}
                id="menu-list-grow"
                onKeyDown={handleListKeyDown}
              >
                <Link to={"/profile/" + auth.uid}>
                  <MenuItem onClick={handleClose}>My account</MenuItem>
                </Link>
                <MenuItem
                  onClick={props.signOut}
                  // onClick={e => {
                  //   window.location.href = "/";
                  //   console.log(test, "state");
                  //   props.history.push("/");
                  //   props.signOut();
                  // }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  ////////////////////////////////////notification submenu

  return (
    // <div className={classes.grow}>
    //   <AppBar position="static" color="inherit">
    //     <Container>
    //       <Toolbar>
    //         <div className={classes.grow} />
    <div className={classes.sectionDesktop}>
      <Tooltip title="Profile" enterDelay={500} leaveTouchDelay={0}>
        <IconButton
          aria-label="show 17 new notifications"
          color="inherit"
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
        >
          <AccountCircle />
        </IconButton>
      </Tooltip>

      {renderProfileSubmenu}
    </div>
    //       </Toolbar>
    //     </Container>
    //   </AppBar>
    // </div>
  );
};

const mapStateToProps = (state, props) => {
  console.log(state, "from profile");
  return {
    test: state,
    auth: state.firebase.auth,
    composite: state.firestore.composite,
    notif: state.firebase.profile.notif
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
