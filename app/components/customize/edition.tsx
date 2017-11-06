import * as React from 'react';
import { connect } from 'react-redux';

class CustomizeEdition extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <div>Customize Edition Page</div>
  }
}

function select(state) {
  return {
    customize: state.customize,
    classroomLesson: state.classroomLessons
  }
}

export default connect(select)(CustomizeEdition)
