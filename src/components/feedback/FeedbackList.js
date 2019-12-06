import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
}));

const classifyMood = mood => {
  if (mood < -0.55) return "Negative";
  else if (mood < -0.1) return "Slightly Negative";
  else if (mood < 0.1) return "Neutral";
  else if (mood < 0.55) return "Slightly Positive";
  else return "Positive";
};

export default function FeedbackList(props) {
  const classes = useStyles();
  const { feedbacks } = props;

  var temp = [];

  if (feedbacks.length > 1) {
    for (var i = 1; i < feedbacks.length; i++) {
      temp.push(feedbacks[i]);
    }
  }

  return (
    <div>
      {feedbacks ? (
        <List className={classes.root}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>
                <AccountCircleIcon fontSize="large" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={classifyMood(feedbacks[0].mood)}
              secondary={
                <React.Fragment>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                  >
                    {feedbacks[0].username}
                  </Typography>
                  {" — "}
                  {feedbacks[0].feedback}
                </React.Fragment>
              }
            />
          </ListItem>

          {temp ? (
            <div>
              {temp.map((fb, index) => (
                <div key={index}>
                  <Divider variant="inset" component="li" />
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>
                        <AccountCircleIcon fontSize="large" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={classifyMood(fb.mood)}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            className={classes.inline}
                            color="textPrimary"
                          >
                            {fb.username}
                          </Typography>
                          {" — "}
                          {fb.feedback}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                </div>
              ))}
            </div>
          ) : (
            ""
          )}
        </List>
      ) : (
        ""
      )}
    </div>
  );
}
