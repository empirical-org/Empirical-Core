import React from 'react';
import request from 'request';

export default class ChooseClassroomLesson extends React.Component {
  constructor(props) {
    super(props);

    this.getClassroomLessonInfo();
  }

  getClassroomLessonInfo() {
    request.get(`${process.env.DEFAULT_URL}/teachers/units/${this.props.params.unitId}/activities/${this.props.params.activityId}`, (error, httpStatus, body) => {
    });
  }

  render() {
    return (<div />);
  }
}
