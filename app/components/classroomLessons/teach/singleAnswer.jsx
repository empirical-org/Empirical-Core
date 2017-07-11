import React, { Component } from 'react';
import ScriptComponent from '../shared/scriptComponent.tsx';

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
    if (submissions) {
      const submissionComponents = Object.keys(submissions[current_slide]).map(key => (
        <li
          style={{
            marginTop: 10,
            borderBottom: '1px solid magenta',
          }}
        >
          <input
            type="checkbox"
            name="students[key]"
            checked={selected_submissions && selected_submissions[current_slide] ? selected_submissions[current_slide][key] : false}
            onClick={(e) => { this.toggleSelected(e, current_slide, key); }}
          />
          {submissions[current_slide][key]} - {students[key]}

        </li>
        ));
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
    const { selected_submissions, submissions, current_slide, students, presence, modes, timestamps, flaggedStudents } = this.props.data;
    const showHeaderText = this.props.onlyShowHeaders ? 'Show Step-By-Step Guide' : 'Hide Step-By-Step Guide'
    return (
      <div className="teacher-single-answer">
        <div className="header">
          <h1>
            <span>Slide {this.props.data.current_slide}:</span> {this.props.data.questions[this.props.data.current_slide].data.teach.title}
          </h1>
          <p onClick={this.props.toggleOnlyShowHeaders}>
            {showHeaderText}
          </p>
        </div>
        <ScriptComponent
          script={this.props.data.questions[this.props.data.current_slide].data.teach.script}
          selected_submissions={selected_submissions}
          submissions={submissions}
          current_slide={current_slide}
          students={students}
          presence={presence}
          modes={modes}
          flaggedStudents={flaggedStudents}
          startDisplayingAnswers={this.startDisplayingAnswers}
          stopDisplayingAnswers={this.stopDisplayingAnswers}
          toggleSelected={this.toggleSelected}
          timestamps={timestamps}
          onlyShowHeaders={this.props.onlyShowHeaders}
          clearAllSelectedSubmissions={this.props.clearAllSelectedSubmissions}
          clearAllSubmissions={this.props.clearAllSubmissions}
          toggleStudentFlag={this.props.toggleStudentFlag}
        />

      </div>
    );
  }

}

export default SingleAnswer;
