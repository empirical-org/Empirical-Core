import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/lessons';
import _ from 'underscore';
import {
  Modal,
  ArchivedButton,
  FlagDropdown
} from 'quill-component-library/dist/componentLibrary';
import { LinkListItem } from '../shared/linkListItem';
import EditLessonForm from './lessonForm.jsx';

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
    const questionsData = this.props.questions.data
    let keys = _.keys(data);
    if (flag !== 'All Flags') {
      keys = _.filter(keys, key => data[key].flag === flag);
    }
    if (this.state.showOnlyArchived) {
      keys = keys.filter((key) => {
        return data[key].questions && data[key].questions.some((q) => {
          const question = questionsData[q.key]
          return question && question.flag === 'archived'
        })
      })
    }
    return keys.map(key => (
      <LinkListItem
        activeClassName='is-active'
        basePath='lessons'
        excludeResponses={true}
        itemKey={key}
        key={key}
        text={data[key].name || 'No name'}
      />
    ));
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
    lessons: state.lessons,
    routing: state.routing,
    questions: state.questions,
  };
}

export default connect(select)(Lessons);
