import React from 'react';

export default class RecommendationsOverview extends React.Component {
  constructor(props) {
    super();
    this.scrollToLessons = this.scrollToLessons.bind(this);
    this.scrollToIndependent = this.scrollToIndependent.bind(this);
  }

  scrollToLessons() {
    document.getElementById('lessons-recommendations-wrapper').scrollIntoView();
  }

  scrollToIndependent() {
    document.getElementById('recommendations-scroll-to').scrollIntoView();
  }

  render() {
    return (
      <div className="recommendations-overview center-text">
        <h3>Quill now provides both <strong>Group Lessons</strong> and <strong>Independent Practice</strong></h3>
        <p>In the new Quill Lessons tool, you can teach writing skills to your class through a set of teacher-led slides.</p>
        <div className="flex-row space-between button-group">
          <a onClick={this.scrollToLessons} className="q-button text-quillblue bg-white">
            <img src="https://assets.quill.org/images/icons/group-lesson-icon-blue.svg" alt="group-lesson-logo" />
            View Class Lessons
          </a>
          <a onClick={this.scrollToIndependent} className="q-button text-quillblue bg-white">
            <img src="https://assets.quill.org/images/icons/independent-lesson-black.svg" alt="independent-lesson-logo" />
            View Independent Practice</a>
        </div>
      </div>);
  }
}
