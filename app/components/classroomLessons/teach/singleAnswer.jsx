import React, { Component } from 'react';

class SingleAnswer extends Component {
  constructor(props) {
    super(props);
  }


  renderNextSlideButton() {
    return (
      <button onClick={this.props.goToNextSlide} >Next Slide</button>
    );
  }

  render() {
    return (
      <div>
        <h1>
          Single Answer Page
        </h1>
        {this.renderNextSlideButton()}
      </div>
    );
  }

}

export default SingleAnswer;
