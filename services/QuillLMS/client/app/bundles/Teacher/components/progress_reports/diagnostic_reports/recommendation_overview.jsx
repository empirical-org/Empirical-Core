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
        <h3>Quill now provides both <strong>Teacher-Led Activities</strong> and <strong>Independent Activities</strong></h3>
        <p>In the new Quill Lessons tool, you can teach writing skills to your class through a set of teacher-led slides.</p>
        <div className="flex-row space-between button-group">
          <a className="q-button text-quillblue bg-white" onClick={this.scrollToLessons}>
            <img alt="group-lesson-logo" src="https://assets.quill.org/images/icons/group-lesson-icon-blue.svg" />
            View Teacher-Led Activities
          </a>
          <a className="q-button text-quillblue bg-white" onClick={this.scrollToIndependent}>
            <img alt="independent-lesson-logo" src="https://assets.quill.org/images/icons/independent-lesson-black.svg" />
            View Independent Activities</a>
        </div>
      </div>);
  }
}
