import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getParameterByName } from 'libs/getParameterByName';
import {
  updateCurrentSlide,
  updateSlideInFirebase
} from '../../../actions/classroomSessions';
import CLStudentLobby from '../play/lobby';
import CLStudentStatic from '../play/static';
import CLStudentSingleAnswer from '../play/singleAnswer';
import {
  ClassroomLessonSession,
  QuestionSubmissionsList
} from '../interfaces';
import {
  ClassroomLesson
} from 'interfaces/classroomLessons';


class Sidebar extends React.Component<any, any> {

  constructor(props) {
    super(props);
  }

  goToSlide(slide_id: string) {
    const caId: string|null = getParameterByName('classroom_activity_id');
    if (caId) {
      this.props.dispatch(updateCurrentSlide(caId, slide_id));
    }
  }

  render() {
    const { data, hasreceiveddata, }: { data: ClassroomLessonSession, hasreceiveddata: boolean } = this.props.classroomSessions;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
    const lessonDataLoaded: boolean = this.props.classroomLesson.hasreceiveddata;
    if (hasreceiveddata && data && lessonDataLoaded) {
      const questions = lessonData.questions;
      const length = questions.length;
      const currentSlide = data.current_slide;
      const components: JSX.Element[] = [];
      let counter = 0;
      for (const slide in questions) {
        counter += 1;
        const activeClass = currentSlide === slide ? 'active' : '';
        let thumb;
        switch (questions[slide].type) {
          case 'CL-LB':
            thumb = (
              <CLStudentLobby data={data} title={lessonData.title}/>
            );
            break;
          case 'CL-ST':
            thumb = (
              <CLStudentStatic data={questions[slide].data} />
            );
            break;
          case 'CL-SA':
            const mode: string | null = data.modes && data.modes[slide] ? data.modes[slide] : null;
            const submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[slide] ? data.submissions[slide] : null;
            const selected_submissions = data.selected_submissions && data.selected_submissions[slide] ? data.selected_submissions[slide] : null;
            const props = { mode, submissions, selected_submissions, };
            thumb = (
              <CLStudentSingleAnswer data={questions[slide].data} handleStudentSubmission={() => {}} {...props} />
            );
            break;
          default:
            thumb = questions[slide].type;
        }
        components.push((
          <div key={counter} onClick={() => this.goToSlide(slide)}>
            <p className={`slide-number ${activeClass}`}>Slide {counter} / {length}</p>
            <div className={`slide-preview ${activeClass}`}>
              <div className="scaler">
                {thumb}
              </div>
            </div>
          </div>
        ));
      }
      return (
        <div className="side-bar">
          {components}
        </div>
      );
    }
    return (
      <div className="side-bar">
          Loading...
        </div>
    );
  }

}

function select(props) {
  return {
    classroomSessions: props.classroomSessions,
    classroomLesson: props.classroomLesson
  };
}

export default connect(select)(Sidebar);
