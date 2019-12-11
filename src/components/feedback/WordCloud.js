import React from "react";
import ReactWordcloud from "react-wordcloud";
import { connect } from "react-redux";
import { compose } from "redux";
import { fetchWords } from "../../store/actions/trainingActions";

const options = {
  colors: ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b"],
  enableTooltip: true,
  deterministic: false,
  fontFamily: "impact",
  fontSizes: [12, 60],
  fontStyle: "normal",
  fontWeight: "normal",
  padding: 0,
  rotations: 0,
  rotationAngles: [0, 90],
  scale: "linear",
  spiral: "archimedean",
  transitionDuration: 1000
};

class WordCloud extends React.Component {
  // state = {
  //   currentID: -1
  // };

  curr = -1;
  render() {
    const { id, words } = this.props;
    // const { currentID } = this.state;
    // if (currentID !== id) {
    //   this.setState({ currentID: id });
    //   this.props.fetchWords(id);
    // }
    if (this.curr !== id) {
      this.curr = id;
      this.props.fetchWords(id);
    }

    return (
      <div>
        <div style={{ height: "100%", width: "100%" }}>
          <ReactWordcloud
            options={options}
            words={
              this.curr === id
                ? words.length === 0
                  ? [{ text: "Not enough Data", value: 1 }]
                  : words
                : []
            }
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    words: state.training.words
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWords: id => dispatch(fetchWords(id))
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(WordCloud);
