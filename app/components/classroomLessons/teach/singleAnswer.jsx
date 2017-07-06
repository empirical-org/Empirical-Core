import React, { Component } from 'react';

class SingleAnswer extends Component {
  constructor(props) {
    super(props);
    this.toggleSelected = this.toggleSelected.bind(this);
    this.startDisplayingAnswers = this.startDisplayingAnswers.bind(this);
    this.stopDisplayingAnswers = this.stopDisplayingAnswers.bind(this);
  }

  toggleSelected(event, current_slide, student) {
    this.props.toggleSelected(current_slide, student);
  }

  startDisplayingAnswers() {
    this.props.startDisplayingAnswers();
  }

  stopDisplayingAnswers() {
    this.props.stopDisplayingAnswers();
  }

  renderReview(item) {
    const { selected_submissions, submissions, current_slide, students, } = this.props.data;
    let submissionComponents;
    if (submissions) {
      submissionComponents = Object.keys(submissions[current_slide]).map(key => (
        <li
          key={key}
          style={{
            marginTop: 10,
            borderBottom: '1px solid magenta',
          }}
        >
          <input type="checkbox" name="students[key]" checked={selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][key] : false} onClick={(e) => { this.toggleSelected(e, current_slide, key); }} />
          {submissions[current_slide][key]} - {students[key]}

        </li>
        ));
    }
    return (
      <div>
        <ul
          style={{
            margin: 10,
            padding: 10,
            border: '1px solid magenta',
          }}
        >
          {submissionComponents}
        </ul>
        <button onClick={this.startDisplayingAnswers}>Display Selected Answers</button>
        <button onClick={this.stopDisplayingAnswers}>Stop displaying student answers</button>
      </div>
    );
  }

  renderScript(script) {
    return script.map((item, index) => {
      if (item.type === 'T-REVIEW') {
        return <li key={`${item.type + index.toString()}`}>{this.renderReview(item)}</li>;
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
      </div>
    );
  }

}

export default SingleAnswer;
