declare function require(name:string);
import * as React from 'react';
import { connect } from 'react-redux';
import {
    updateCurrentSlide
} from '../../../actions/classroomSessions';
import {
    ClassroomLesson
} from '../../../interfaces/classroomLessons';
import * as CustomizeIntf from '../../../interfaces/customize';
import { getParameterByName } from '../../../libs/getParameterByName';
import {
    ClassroomLessonSession, ClassroomUnitId, QuestionSubmissionsList
} from '../interfaces';
import CLStudentFillInTheBlank from '../play/fillInTheBlank';
import CLStudentListBlanks from '../play/listBlanks';
import CLStudentLobby from '../play/lobby';
import CLStudentModelQuestion from '../play/modelQuestion';
import CLStudentMultistep from '../play/multistep';
import CLStudentSingleAnswer from '../play/singleAnswer';
import CLStudentStatic from '../play/static';
const studentIcon = 'https://assets.quill.org/images/icons/student_icon.svg'

interface ReducerSidebarProps extends React.Props<any> {
  classroomSessions: any,
  classroomLesson: any,
  customize: any,
}

interface PassedSidebarProps extends React.Props<any> {
  match: any,
  classroomSessionId?: string
}

class Sidebar extends React.Component<ReducerSidebarProps & PassedSidebarProps & DispatchFromProps, any> {

  constructor(props) {
    super(props);

    const classroomUnitId: ClassroomUnitId|null = getParameterByName('classroom_unit_id')
    this.state = {
      classroomUnitId,
      currentSlide: null
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.classroomSessions.data.current_slide !== this.props.classroomSessions.data.current_slide) {
      this.scrollToSlide(nextProps.classroomSessions.data.current_slide)
    }
  }

  UNSAFE_componentWillUpdate(prevProps, prevState) {
    if (!this.state.currentSlide) {
      this.scrollToSlide(this.props.classroomSessions.data.current_slide)
    }
  }

  scrollToSlide(slide_id: string) {
    const el = document.getElementById(slide_id)
    const sidebar = document.getElementsByClassName("side-bar")[0];
    if (el && sidebar) {
      this.setState({
        currentSlide: el,
      })
      this.scrollToPosition(sidebar, el.offsetTop - 65, 0)
    }
  }

  // borrowed from https://stackoverflow.com/questions/12102118/scrollintoview-animation/32484034
  scrollToPosition(elem, pos, count) {
    if (count > 15) {
      return;
    }
    let y = elem.scrollTop;
    y += Math.round( ( pos - y ) * 0.3 );
    if (Math.abs(y-pos) <= 2) {
      elem.scrollTop = pos;
      return;
    }
    elem.scrollTop = y;
    setTimeout(() => {this.scrollToPosition(elem, this.state.currentSlide.offsetTop - 105, count+1)}, 40);
  }

  goToSlide = (slide_id: string) => {
    const { dispatch, classroomSessionId, } = this.props
    if (classroomSessionId) {
      dispatch(updateCurrentSlide(slide_id, classroomSessionId));
    }
  }

  presentStudents() {
    const presence = this.props.classroomSessions.data.presence
    const numPresent = presence === undefined ? 0 : Object.keys(presence).filter((id) => presence[id] === true ).length
    return (
      <div className="present-students"><img alt="" src={studentIcon} /><span> {numPresent} Student{numPresent === 1 ? '': 's'} Viewing</span></div>
    )
  }

  render() {
    const { data, hasreceiveddata, }: { data: ClassroomLessonSession, hasreceiveddata: boolean } = this.props.classroomSessions;
    const lessonData: ClassroomLesson = this.props.classroomLesson.data;
    const lessonDataLoaded: boolean = this.props.classroomLesson.hasreceiveddata;
    const editionData: CustomizeIntf.EditionQuestions = this.props.customize.editionQuestions;
    if (hasreceiveddata && data && lessonDataLoaded) {
      const questions = editionData.questions;
      const length = questions ? Number(questions.length) - 1 : 0;
      const currentSlide = data.current_slide;
      const components: JSX.Element[] = [];
      let counter = 0;
      for (const slide in questions) {
        counter += 1;
        const activeClass = currentSlide === slide ? 'active' : '';
        let thumb;
        let title = editionData.questions[slide].data.teach.title
        let titleSection = title ? <span> - {title}</span> : <span />
        let prompt = data.prompts && data.prompts[slide] ? data.prompts[slide] : null;
        let model: string|null = data.models && data.models[slide] ? data.models[slide] : null;
        let mode: string | null = data.modes && data.modes[slide] ? data.modes[slide] : null;
        let submissions: QuestionSubmissionsList | null = data.submissions && data.submissions[slide] ? data.submissions[slide] : null;
        let selected_submissions = data.selected_submissions && data.selected_submissions[slide] ? data.selected_submissions[slide] : null;
        let selected_submission_order: Array<string>|null = data.selected_submission_order && data.selected_submission_order[slide] ? data.selected_submission_order[slide] : null;
        let props = { mode, submissions, selected_submissions, selected_submission_order};
        switch (questions[slide].type) {
          case 'CL-LB':
            thumb = (
              <CLStudentLobby data={data} projector={true} title={lessonData.title} />
            );
            break;
          case 'CL-ST':
            thumb = (
              <CLStudentStatic data={questions[slide].data} />
            );
            break;
          case 'CL-MD':
            thumb = (
              <CLStudentModelQuestion data={questions[slide].data} model={model} prompt={prompt} />
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
          case 'CL-MS':
            thumb = (
              <CLStudentMultistep data={questions[slide].data} handleStudentSubmission={() => {}} {...props} />
            )
            break;
          default:
            thumb = questions[slide].type;
        }
        const isLobbySlide = Number(slide) === 0
        const headerText = isLobbySlide ? <span>Title Slide{titleSection}</span> : <span>Slide {slide} / {length}{titleSection}</span>
        components.push((
          <div id={slide} key={counter} onClick={() => this.goToSlide(slide)}>
            <div className="sidebar-header">
              <p className={`slide-number ${activeClass}`}>{headerText}</p>
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
    classroomLesson: props.classroomLesson,
    customize: props.customize
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export interface DispatchFromProps {
  dispatch: any;
}

export default connect<ReducerSidebarProps, DispatchFromProps, PassedSidebarProps>(select, dispatch => ({dispatch}))(Sidebar);
