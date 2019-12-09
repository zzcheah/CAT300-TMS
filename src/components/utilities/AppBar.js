import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ViewList from "@material-ui/icons/ViewList";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import NotifSummary from "../Notification/NotifSummary";
import { Link } from "react-router-dom";
import Notification from "../Notification/Notification";
import Profile from "../layout/Profile";
import Manage from "../layout/Manage";
import AddNew from "../layout/AddNew";
import NotificationsOffOutlinedIcon from "@material-ui/icons/NotificationsOffOutlined";
import TableChartIcon from "@material-ui/icons/TableChart";
import DashboardIcon from "@material-ui/icons/Dashboard";
import FeedbackIcon from "@material-ui/icons/Feedback";

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
    display: "block",
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
    // display: "none",
    // [theme.breakpoints.up("sm")]: {
    //   display: "block"
    // }
    display: "block",
    width: "auto",
    height: 38,
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(1)
  }
}));

// export default function PrimarySearchAppBar() {
const PrimarySearchAppBar = props => {
  const { state, role, notif, auth, initials } = props;
  console.log(role, "role");

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

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
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={notif} color="secondary" showZero={false}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  ////////////////////////////////////notification submenu

  return (
    <div className={classes.grow}>
      <AppBar position="static" color="inherit">
        <Container>
          <Toolbar>
            <NavLink to="/">
              <img
                src={require("../../images/logo.png")}
                alt="tms"
                className={classes.logo}
              />
            </NavLink>
            <Typography className={classes.title} variant="h5">
              Training Management System
            </Typography>

            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <NavLink to="/dashboard">
                <IconButton>
                  <DashboardIcon style={{ color: "black" }} />
                </IconButton>
              </NavLink>

              {role && role == "admin" ? <AddNew /> : null}
              {role && role == "admin" ? <Manage /> : null}
              {role && role == "admin" ? (
                <NavLink to="/Recommendation">
                  <IconButton aria-label="show 4 new mails">
                    <TableChartIcon style={{ color: "black" }} />
                  </IconButton>
                </NavLink>
              ) : null}

              {role && role == "admin" ? (
                <NavLink to="/feedback">
                  <IconButton>
                    <FeedbackIcon style={{ color: "black" }} />
                  </IconButton>
                </NavLink>
              ) : null}
              <NavLink to="/feedback">
                <IconButton>
                  <FeedbackIcon style={{ color: "black" }} />
                </IconButton>
              </NavLink>

              {isLoaded(auth) ? (
                <Notification uid={auth.uid} />
              ) : (
                <NotificationsOffOutlinedIcon />
              )}

              {isLoaded(auth) ? <Profile /> : <AccountCircle />}
            </div>

            {initials ? (
              <Typography
                className={classes.title}
                variant="subtitle1"
                noWrap
                style={{ maxWidth: "70px" }}
              >
                {initials}
              </Typography>
            ) : null}

            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </Container>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
};

const mapStateToProps = state => {
  console.log(state, "from appbar");
  return {
    auth: state.firebase.auth,
    composite: state.firestore.composite,
    notif: state.firebase.profile.notif,
    role: state.firebase.profile.role,
    initials: state.firebase.profile.initials
  };
};

export default compose(
  connect(mapStateToProps)
  // firestoreConnect([
  //   {
  //     collection: "notifications",
  //     orderBy: ["dateTime", "desc"],
  //     where: ["targets", "array-contains", "nqc6gqvpWSQZtHUvSGuufXKna2D2"]
  //   }
  // ])
)(PrimarySearchAppBar);
