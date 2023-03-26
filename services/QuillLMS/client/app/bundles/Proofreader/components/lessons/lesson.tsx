import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import EditLessonForm from './lessonForm';

import { ActionTypes } from '../../actions/actionTypes';
import * as lessonActions from '../../actions/proofreaderActivities';
import { ProofreaderActivity } from '../../interfaces/proofreaderActivities';
import { ConceptReducerState } from '../../reducers/conceptsReducer';
import { ProofreaderActivityState } from '../../reducers/proofreaderActivitiesReducer';
import ProofreaderActivityContainer from '../proofreaderActivities/container';

interface LessonProps {
  dispatch: Function;
  match: any;
  lessons: ProofreaderActivityState;
  concepts: ConceptReducerState;
}

export class Lesson extends React.Component<LessonProps> {

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  handleDeleteLesson = (): void => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    if (lessonID && confirm('do you want to do this?')) {
      dispatch(lessonActions.deleteLesson(lessonID));
    }
  }

  cancelEditingLesson = (): void => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    if (lessonID) {
      dispatch(lessonActions.cancelLessonEdit(lessonID));
    }
  }

  saveLessonEdits = (vals: ProofreaderActivity): void => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    if (lessonID) {
      dispatch(lessonActions.submitLessonEdit(lessonID, vals));
    }
  }

  handleEditLesson = (): void => {
    const { dispatch, match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    if (lessonID) {
      dispatch(lessonActions.startLessonEdit(lessonID));
    }
  }

  renderActivity = () => {
    const { match } = this.props;
    const { params } = match;
    const { lessonID } = params;
    return (
      <div style={{marginTop: '50px', border: '1px solid black', paddingBottom: '50px'}}>
        <ProofreaderActivityContainer activityUID={lessonID} admin={true} />
      </div>
    )
  }

  render() {
    const { match, lessons } = this.props;
    const { data, states, hasreceiveddata } = lessons
    const { params } = match;
    const { lessonID } = params;
    if(!hasreceiveddata) {
      return (<p>Loading...</p>);
    } else if (data && lessonID && data[lessonID]) {
      const lesson = data[lessonID];
      if(states && states[lessonID] === ActionTypes.EDITING_LESSON) {
        return(
          <EditLessonForm
            currentValues={lesson}
            lesson={lesson}
            returnToView={this.cancelEditingLesson}
            submit={this.saveLessonEdits}
          />
        );
      }
      return (
        <div className="lesson-container">
          <Link to='/admin/lessons'>Return to All Activities</Link>
          <br />
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title">{data[lessonID].title}</h4>
            <h6 className="subtitle" style={{ color: 'rgb(0, 194, 162)', paddingRight: '20px' }}>Flag: {data[lessonID].flag}</h6>
          </div>
          <h6 className="subtitle"><Link to={`/play/pf?anonymous=true&uid=${lessonID}`}>Play Proofreader Activity</Link></h6>
          <p className="control">
            <button className="button is-info" onClick={this.handleEditLesson} type="button">Edit Activity</button>
            <button className="button is-danger" onClick={this.handleDeleteLesson} type="button">Delete Activity</button>
          </p>
          <p style={{marginTop: '50px'}}>Note: the activity below functions exactly like the real activity, except that you will not be directed to a results page or to a Grammar activity upon finishing the review. Instead, the activity will reset.</p>
          {this.renderActivity()}
        </div>
      );
    }
    return (
      <p>404: No Concept Found</p>
    );
  }

}

function select(state: any) {
  return {
    lessons: state.proofreaderActivities,
    routing: state.routing,
    concepts: state.concepts
  };
}

export default connect(select)(Lesson);
