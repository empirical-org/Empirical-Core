import React, { Component } from 'react';
import {
QuestionData
} from '../../../interfaces/ClassroomLessons'

interface StaticProps {
  data: QuestionData
}

interface StaticState {}

class Static extends Component<StaticProps, StaticState> {
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
