import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/lessons';
import _ from 'underscore';
import {
  Modal,
  LinkListItem,
  ArchivedButton,
  FlagDropdown
} from 'quill-component-library/dist/componentLibrary';
import EditLessonForm from './lessonForm.jsx';

class Lessons extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lessonFlags: 'production',
      showOnlyArchived: false,
    }

    this.createNew = this.createNew.bind(this)
    this.submitNewLesson = this.submitNewLesson.bind(this)
    this.toggleShowArchived = this.toggleShowArchived.bind(this)
    this.renderLessons = this.renderLessons.bind(this)
    this.renderModal = this.renderModal.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

  }

  createNew() {
    this.props.dispatch(actions.toggleNewLessonModal());
  }

  submitNewLesson(data) {
    this.props.dispatch(actions.submitNewLesson(data));
    // this.props.dispatch(actions.toggleNewLessonModal())
  }

  toggleShowArchived() {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  }

  renderLessons() {
    const { data, } = this.props.lessons;
    const questionsData = this.props.questions.data
    let keys = _.keys(data);
    if (this.state.lessonFlags !== 'All Flags') {
      keys = _.filter(keys, key => data[key].flag === this.state.lessonFlags);
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
        itemKey={key}
        key={key}
        text={data[key].name || 'No name'}
      />
    ));
  }

  renderModal() {
    const stateSpecificClass = this.props.lessons.submittingnew ? 'is-loading' : '';
    if (this.props.lessons.newLessonModalOpen) {
      return (
        <Modal close={this.createNew}>
          <EditLessonForm stateSpecificClass={stateSpecificClass} submit={this.submitNewLesson} />
        </Modal>
      );
    }
  }

  handleSelect(e) {
    this.setState({ lessonFlags: e.target.value, });
  }

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title"><button className="button is-primary" onClick={this.createNew}>Create New Activity</button></h1>
          { this.renderModal() }
          <div style={{display: 'inline-block'}}>
            <FlagDropdown flag={this.state.lessonFlags} handleFlagChange={this.handleSelect} isLessons={true}/>
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
