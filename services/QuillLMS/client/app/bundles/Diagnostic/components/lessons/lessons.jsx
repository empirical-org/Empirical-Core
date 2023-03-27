import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import {
    ArchivedButton,
    FlagDropdown, Modal
} from '../../../Shared/index';
import actions from '../../actions/lessons.ts';
import { LinkListItem } from '../shared/linkListItem';
import EditLessonForm from './lessonForm.tsx';

class Lessons extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lessonFlags: 'production',
      showOnlyArchived: false,
    }
  }

  createNew = () => {
    this.props.dispatch(actions.toggleNewLessonModal());
  };

  submitNewLesson = data => {
    // TODO: fix add new lesson action to show new lessons without refreshing
    this.props.dispatch(actions.submitNewLesson(data));
    this.props.dispatch(actions.toggleNewLessonModal())
  };

  toggleShowArchived = () => {
    this.setState({
      showOnlyArchived: !this.state.showOnlyArchived,
    });
  };

  renderLessons = () => {
    const { data, } = this.props.lessons;
    let keys = _.keys(data);
    if (this.state.lessonFlags !== 'All Flags') {
      keys = _.filter(keys, key => data[key].flag === this.state.lessonFlags);
    }
    if (this.state.showOnlyArchived) {
      keys = keys.filter(key => data[key].questions && data[key].questions.some(q => q.flag === 'archived'))
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

  handleSelect = e => {
    this.setState({ lessonFlags: e.target.value, });
  };

  render() {
    return (
      <section className="section">
        <div className="container">
          <h1 className="title"><button className="button is-primary" onClick={this.createNew}>Create New Activity</button></h1>
          { this.renderModal() }
          <div style={{display: 'inline-block'}}>
            <FlagDropdown flag={this.state.lessonFlags} handleFlagChange={this.handleSelect} isLessons={true} />
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
