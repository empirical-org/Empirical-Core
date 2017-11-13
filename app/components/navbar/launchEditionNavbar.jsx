import * as React from 'react';
import { connect } from 'react-redux';

class LaunchEditionNavbar extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  renderCustomizedEditionsTag() {
    const {editions} = this.props.customize
    const customEdition = Object.keys(editions).find(e => {
      return editions[e].lesson_id === this.props.params.lessonID
    })
    if (customEdition) {
      return <div className="custom-editions-tag">Customized Editions</div>
    }
  }

  render() {
    return (
      <div className="lessons-teacher-navbar">
        <p className="lesson-title"><span>Lesson {this.props.classroomLesson.data.lesson}:</span> {this.props.classroomLesson.data.title} {this.renderCustomizedEditionsTag()}</p>
      </div>
    );
  }
}

function select(props) {
  return {
    classroomLesson: props.classroomLesson,
    customize: props.customize
  };
}

export default connect(select)(LaunchEditionNavbar);
