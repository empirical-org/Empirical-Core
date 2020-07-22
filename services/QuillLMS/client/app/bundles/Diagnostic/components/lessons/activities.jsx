import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/lessons.ts';
import _ from 'underscore';
import { Link } from 'react-router-dom';
import { Modal } from 'quill-component-library/dist/componentLibrary';
import EditLessonForm from './lessonForm.tsx';

class Lessons extends React.Component {
  createNew = () => {
    this.props.dispatch(actions.toggleNewLessonModal());
  };

  submitNewLesson = (data) => {
    this.props.dispatch(actions.submitNewLesson(data));
  };

  renderLessons = () => {
    const { data, } = this.props.lessons;

    const l = this.props.lessons.data;
    const q = this.props.questions.data;

    let keys = _.keys(data);
    keys = _.filter(keys, key => data[key].flag === 'production');

    return keys.map((key) => {
      const questionsToDisplay = l[key].questions.map((question) => {
        if (q[question]) {
          const displayName = q[question].prompt || 'No Lesson Name';
          return (
            <li className="menu-list" key={q[question].key}><div className="column">
              <Link to={`/play/questions/${question}`}>{displayName.replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/ig, '')}</Link>
            </div></li>
          );
        } else {
          return (
            <li>Loading</li>
          );
        }
      });

      return (<li key={key}>
        <div className="activities-title">
          <Link activeClassName="is-active" className="menu-label" to={`/play/lesson/${key}`}>{data[key].name}</Link>
          <Link activeClassName="is-active" className="menu-label is-pulled-right" to={`/play/lesson/${key}`}>Start Activity</Link>
        </div>
        <ul>{questionsToDisplay}</ul>
      </li>);
    });
  };

  renderModal = () => {
    const stateSpecificClass = this.props.lessons.submittingnew ? 'is-loading' : '';
    if (this.props.lessons.newLessonModalOpen) {
      return (
        <Modal close={this.createNew}>
          <EditLessonForm renderQuestionSelect={this.renderQuestionSelect} stateSpecificClass={stateSpecificClass} submit={this.submitNewLesson} />
        </Modal>
      );
    }
  };

  render() {
    return (
      <section className="section" id="activities-section">
        <div className="container">
          <h1 className="title is-3">
            Activities
          </h1>
          <h4 className="subtitle is-5">
            Created by our Curriculum Director
          </h4>
          <div className="columns">
            <div className="column">
              <aside className="menu">
                <ul>
                  {this.renderLessons()}
                </ul>
              </aside>
            </div>
            <div className="column">
              {this.props.children}
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
