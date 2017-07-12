import React, { Component } from 'react';
import {
QuestionData
} from 'interfaces/classroomLessons'

class Static extends Component<{data: QuestionData}> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="student-static-page-container"><div className="student-static-page" dangerouslySetInnerHTML={{ __html: this.props.data.play.html, }} /></div>
    );
  }

}

export default Static;
