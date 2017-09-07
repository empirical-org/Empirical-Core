import React, { Component } from 'react';
import ScriptComponent from '../shared/scriptComponent';
import {
  ClassroomLessonSession
} from '../interfaces'
import {
  ClassroomLesson
} from 'interfaces/classroomLessons'

interface StaticProps {
  data: ClassroomLessonSession,
  lessonData: ClassroomLesson,
  toggleOnlyShowHeaders: React.EventHandler<React.MouseEvent<HTMLParagraphElement>>,
  updateToggledHeaderCount: Function,
  onlyShowHeaders?: boolean
}

interface StaticState {}

class Static extends Component<StaticProps, StaticState> {
  constructor(props) {
    super(props);
  }

  render() {
    const showHeaderText = this.props.onlyShowHeaders ? 'Show Step-By-Step Guide' : 'Hide Step-By-Step Guide';
    return (
      <div className="teacher-static">
        <div className="header">
          <h1>
            <span>Slide {parseInt(this.props.data.current_slide) + 1}:</span> {this.props.lessonData.questions[this.props.data.current_slide].data.teach.title}
          </h1>
          <p onClick={this.props.toggleOnlyShowHeaders}>
            {showHeaderText}
          </p>
        </div>
        <ul>
          <ScriptComponent
            script={this.props.lessonData.questions[this.props.data.current_slide].data.teach.script}
            onlyShowHeaders={this.props.onlyShowHeaders}
            updateToggledHeaderCount={this.props.updateToggledHeaderCount}
          />
        </ul>
      </div>
    );
  }

}

export default Static;
