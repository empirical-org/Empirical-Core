declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import { getParameterByName } from 'libs/getParameterByName';
import {
  updateCurrentSlide,
  updateSlideInFirebase
} from '../../../actions/classroomSessions';
import CLStudentLobby from '../play/lobby';
import CLStudentStatic from '../play/static';
import CLStudentSingleAnswer from '../play/singleAnswer';
import CLStudentListBlanks from '../play/listBlanks';
import CLStudentFillInTheBlank from '../play/fillInTheBlank';
import CLStudentModelQuestion from '../play/modelQuestion';
import {
  ClassroomLessonSession,
  QuestionSubmissionsList
} from '../interfaces';
import {
  ClassroomLesson
} from 'interfaces/classroomLessons';
const studentIcon = require('../../../img/student_icon.svg')

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

  presentStudents() {
    const presence = this.props.classroomSessions.data.presence
    const numPresent = presence === undefined ? 0 : Object.keys(presence).filter((id) => presence[id] === true ).length
    return (
      <div className="present-students"><img src={studentIcon}/> {numPresent} Student{numPresent === 1 ? '': 's'} Viewing</div>
    )
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
        let prompt = data.prompts && data.prompts[slide] ? data.prompts[slide] : null;
        let model: string|null = data.models && data.models[slide] ? data.models[slide] : null;
        let mode: string | null = data.modes && data.modes[slide] ? data.modes[slide] : null;
        let submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[slide] ? data.submissions[slide] : null;
        let selected_submissions = data.selected_submissions && data.selected_submissions[slide] ? data.selected_submissions[slide] : null;
        let selected_submission_order = data.selected_submission_order && data.selected_submission_order[slide] ? data.selected_submission_order[slide] : null;
        let props = { mode, submissions, selected_submissions, selected_submission_order};
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
          case 'CL-MD':
            thumb = (
              <CLStudentModelQuestion data={questions[slide].data} model={model} prompt={prompt}/>
            );
            break;
          case 'CL-SA':
            thumb = (
              <CLStudentSingleAnswer data={questions[slide].data} handleStudentSubmission={() => {}} {...props} />
            );
          break
          case 'CL-FB':
            thumb = (
              <CLStudentFillInTheBlank data={questions[slide].data} handleStudentSubmission={() => {}} {...props} />
            );
            break;
          case 'CL-FL':
            thumb = (
              <CLStudentListBlanks data={questions[slide].data} handleStudentSubmission={() => {}} {...props} />
            );
            break;
          case 'CL-EX':
            thumb = (
              <CLStudentStatic data={questions[slide].data} />
            );
            break;
          default:
            thumb = questions[slide].type;
        }
        components.push((
          <div key={counter} onClick={() => this.goToSlide(slide)}>
            <div className="sidebar-header">
            <p className={`slide-number ${activeClass}`}>Slide {counter} / {length}</p>
            {currentSlide === slide ? this.presentStudents() : null}
            </div>
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
