import * as React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';

import EditLessonForm from './lessonForm';

import { FlagDropdown } from '../../../Shared/index';
import * as actions from '../../actions/proofreaderActivities';
import { ProofreaderActivity } from '../../interfaces/proofreaderActivities';
import LinkListItem from '../shared/linkListItem';

interface LessonsProps {
  dispatch: Function;
  lessons: {
    data: any;
    showLessonForm: boolean;
    submittingnew: boolean;
  };
}

interface LessonsState {
  lessonFlags: string;
}

export class Lessons extends React.Component<LessonsProps, LessonsState> {
  state = { lessonFlags: 'production' }

  handleToggle = (e) => {
    if(e) {
      const { dispatch } = this.props;
      dispatch(actions.toggleLessonForm());
    }
  }

  submitNewLesson = (data: ProofreaderActivity) => {
    const { dispatch } = this.props;
    dispatch(actions.submitNewLesson(data));
  }

  renderLessons = () => {
    const { lessonFlags } = this.state;
    const { lessons } = this.props;
    const { data } = lessons;
    let keys = _.keys(data);
    if (lessonFlags !== 'All Flags') {
      keys = keys.filter((key: string) => data[key].flag === lessonFlags);
    }
    return keys.sort((a, b) => {
      const aTitle = data[a].title
      const bTitle = data[b].title
      if (aTitle && bTitle) {
        return aTitle.localeCompare(bTitle)
      } else {
        return a
      }
    }).map((key: string) => (
      <LinkListItem
        activeClassName='is-active'
        basePath='lessons'
        itemKey={key}
        key={key}
        text={data[key].title || 'No name'}
      />
    ));
  }

  onHandleSelect = (e) => {
    this.setState({ lessonFlags: e.target.value, });
  }

  render() {
    const { lessonFlags } = this.state;
    const { lessons } = this.props;
    const { showLessonForm, submittingnew } = lessons;
    const stateSpecificClass = submittingnew ? 'is-loading' : '';
    if (showLessonForm) {
      return (
        <EditLessonForm returnToView={this.handleToggle} stateSpecificClass={stateSpecificClass} submit={this.submitNewLesson} />
      );
    }
    return (
      <section className="section">
        <div className="container">
          <h1 className="title"><button className="button is-primary" onClick={this.handleToggle} type="button">Create New Activity</button></h1>
          <div style={{display: 'inline-block'}}>
            <FlagDropdown flag={lessonFlags} handleFlagChange={this.onHandleSelect} isLessons={true} />
          </div>
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <p className="menu-label">
                  Activities
                </p>
                <ul className="menu-list">
                  {this.renderLessons()}
                </ul>
              </aside>
            </div>
          </div>
        </div>
      </section>

    );
  }
}

function select(state) {
  return {
    lessons: state.proofreaderActivities,
    routing: state.routing,
    questions: state.questions,
  };
}

export default connect(select)(Lessons);
