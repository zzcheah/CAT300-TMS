import React from "react";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { withStyles } from "@material-ui/core/styles";

const useStyles = theme => ({
  rating1: {
    width: 200,
    display: "flex",
    alignItems: "center"
  }
});
class RatingStatistics extends React.Component {
  state = {};

  render() {
    const five = [1, 2, 3, 4, 5];
    const { classes, feedbacks } = this.props;
    var sum = 0;
    var counts = [0, 0, 0, 0, 0];
    feedbacks.forEach(element => {
      // switch (element.rate) {
      //   case 1:
      //     counts[0]++;
      //     break;
      //   case 2:
      //     counts[1]++;
      //     break;
      //   case 3:
      //     counts[2]++;
      //     break;
      //   case 4:
      //     counts[3]++;
      //     break;
      //   case 5:
      //     counts[4]++;
      //     break;
      //   default:
      // }
      counts[element.rate - 1]++;
      sum += element.rate;
    });
    const average = sum / feedbacks.length;
    return (
      <React.Fragment>
        {five.map(element => (
          <Box
            key={element}
            component="fieldset"
            mb={2}
            borderColor="transparent"
          >
            <Typography component="legend">{element} Star</Typography>
            <div className={classes.rating1}>
              <Rating
                name="hover-side"
                value={element}
                size="medium"
                readOnly
              />
              <Box ml={2}>Count: {counts[element - 1]}</Box>
            </div>
          </Box>
        ))}
        <Typography variant="h6">Overall Rating: {average}</Typography>
      </React.Fragment>
    );
  }
}

// class Bar extends React.Component {
//   render() {
//     // aggregateRating = 2.35;
//     return (
//       <StarRatings rating={2.403} starDimension="40px" starSpacing="15px" />
//     );
//   }
// }

export default withStyles(useStyles)(RatingStatistics);
