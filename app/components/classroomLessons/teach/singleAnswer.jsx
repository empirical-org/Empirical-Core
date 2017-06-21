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

  renderReview(item) {
    const { submissions, current_slide, students, } = this.props.data;
    const submissionComponents = Object.keys(submissions[current_slide]).map(key => (
      <li
        style={{
          marginTop: 10,
          borderBottom: '1px solid magenta',
        }}
      >
        {submissions[current_slide][key]} - {students[key]}
      </li>
      ));
    return (
      <ul
        style={{
          margin: 10,
          padding: 10,
          border: '1px solid magenta',
        }}
      >
        {submissionComponents}
      </ul>
    );
  }

  renderScript(script) {
    return script.map((item) => {
      if (item.type === 'T-REVIEW') {
        return <li>{this.renderReview(item)}</li>;
      }
      return (
        <li>
          {item.text}
        </li>
      );
    });
  }

  render() {
    return (
      <div>
        <h1>
          Single Answer Page
        </h1>
        <ul>
          {this.renderScript(this.props.data.questions[this.props.data.current_slide].data.teach.script)}
        </ul>
        {this.renderNextSlideButton()}
      </div>
    );
  }

}

export default SingleAnswer;
