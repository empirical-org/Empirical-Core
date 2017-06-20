import React, { Component } from 'react';

class Static extends Component {
  constructor(props) {
    super(props);
  }


  renderNextSlideButton() {
    return (
      <button onClick={this.props.goToNextSlide} >Next Slide</button>
    );
  }

  renderScript(script) {
    return script.map((item) => {
      return (
        <li>
          {item.text}
        </li>
      )
    })
  }

  render() {
    return (
      <div>
        <h1>
          Static Page
        </h1>
        <ul>
          {this.renderScript(this.props.data.questions[this.props.data.current_slide].data.teach.script)}
        </ul>
        {this.renderNextSlideButton()}
      </div>
    );
  }

}

export default Static;
