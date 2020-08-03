import * as React from 'react';
import { connect } from 'react-redux';

class LaunchEditionNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  renderCustomizedEditionsTag() {
    const { editions } = this.props.customize
    const customEdition = Object.keys(editions).find(e => {
      return editions[e].lesson_id === this.props.match.params.lessonID && editions[e].user_id !== 'quill-staff'
    })
    if (customEdition) {
      return <div className="custom-editions-tag">Customized</div>
    }
  }

  render() {
    return (
      <div className="lessons-teacher-navbar">
        <div className="lesson-title"><p><span>Lesson {this.props.classroomLesson.data.lesson}:</span> {this.props.classroomLesson.data.title}</p> {this.renderCustomizedEditionsTag()}</div>
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
