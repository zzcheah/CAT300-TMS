import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

const NotifItem = ({ notification }) => {
  const classes = useStyles();
  const date = moment(notification.data.dateTime.toDate()).format("LLL");

  console.log(notification);
  return notification ? (
    <Card className={classes.card}>
      <CardContent>
        {/* <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Word of the Day
        </Typography> */}
        <Typography variant="h5" component="h2">
          {notification.data.trainingTitle}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {date}
        </Typography>
        {/* <Typography variant="body2" component="p">
          well meaning and kindly.
          <br />
          {'"a benevolent smile"'}
        </Typography> */}
      </CardContent>
      <CardActions>
        <Link
          to={
            "/createFeedback/" +
            // notification.data.trainingTitle +
            // "/" +
            notification.data.trainingId +
            "/" +
            notification.id
          }
        >
          <Button size="small">Write Feedback</Button>
        </Link>
      </CardActions>
    </Card>
  ) : (
    ""
  );

  //   return (
  //     <div className="card z-depth-0 training-summary">
  //       <div className="card-content grey-text text-darken-3">
  //         <span className="card-title">{notification.trainingTitle}</span>
  //         <p>{notification.trainingId} </p>
  //         <p className="grey-text">
  //           started at {moment(notification.dateTime.toDate()).format("LLL")}
  //         </p>
  //       </div>
  //     </div>
  //   );
};

export default NotifItem;
