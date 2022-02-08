import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/lessons';
import _ from 'underscore';
import EditLessonForm from './lessonForm.jsx';
import { ExpandLessonQuestions } from './expandLessonQuestions';
import {
  Modal,
  ArchivedButton,
  FlagDropdown,
} from '../../../Shared/index';

class Lessons extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showOnlyArchived: false,
    }
  }

  createNew = () => {
    this.props.dispatch(actions.toggleNewLessonModal());
  };

  handleSelect = e => {
    const { dispatch } = this.props
    dispatch(actions.setFlag(e.target.value));
  };

  submitNewLesson = data => {
    this.props.dispatch(actions.submitNewLesson(data));
  };

  toggleShowArchived = () => {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  };

  renderLessons = () => {
    const { data, flag } = this.props.lessons;
    let keys = _.keys(data);
    if (flag !== 'All Flags') {
      keys = keys.filter(key => data[key] && data[key].flag === flag);
    }
    if (this.state.showOnlyArchived) {
      keys = keys.filter((key) => {
        return data[key].questions && data[key].questions.some((q) => {
          const questionsData = this.props[q.questionType].data
          const question = questionsData[q.key]
          return question && question.flag === 'archived'
        })
      })
    }
    return keys.map(key => {
      if (!data[key].questions) {
        return ''
      }
      let questions = data[key].questions.map((q) => {
        const questionsData = this.props[q.questionType].data
        if (questionsData[q.key]) return questionsData[q.key].prompt
        return ''
      })
      return (
        <ExpandLessonQuestions
          activeClassName='is-active'
          basePath='lessons'
          className='activity-link'
          goToButtonText='View Activity'
          itemKey={key}
          key={key}
          listElements={questions}
          showHideButtonText={{'show':'Show Prompts','hide':'Hide Prompts'}}
          text={data[key].name || 'No name'}
        />
      )
    });
  };

  renderModal = () => {
    const stateSpecificClass = this.props.lessons.submittingnew ? 'is-loading' : '';
    if (this.props.lessons.newLessonModalOpen) {
      return (
        <Modal close={this.createNew}>
          <EditLessonForm stateSpecificClass={stateSpecificClass} submit={this.submitNewLesson} />
        </Modal>
      );
    }
  };

  render() {
    const { lessons } = this.props
    return (
      <section className="section">
        <div className="container">
          <h1 className="title"><button className="button is-primary" onClick={this.createNew}>Create New Activity</button></h1>
          { this.renderModal() }
          <div style={{display: 'inline-block'}}>
            <FlagDropdown flag={lessons.flag} handleFlagChange={this.handleSelect} isLessons={true} />
          </div>
          <ArchivedButton lessons={true} showOnlyArchived={this.state.showOnlyArchived} toggleShowArchived={this.toggleShowArchived} />
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <p className="menu-label">
                  Activities
                </p>
                <ul className="menu-list activities-list">
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
    lessons: state.lessons,
    routing: state.routing,
    questions: state.questions,
    sentenceFragments: state.sentenceFragments,
    fillInBlank: state.fillInBlank,
    titleCards: state.titleCards
  };
}

export default connect(select)(Lessons);
