import React from 'react';
import { connect } from 'react-redux';
import actions from '../../actions/lessons';
import _ from 'underscore';
import { Link } from 'react-router';
import Modal from '../modal/modal.jsx';
import { hashToCollection } from '../../libs/hashToCollection';
import EditLessonForm from './lessonForm.jsx';
import renderQuestionSelect from './lessonForm.jsx';
import renderQuestionsForLesson from './lesson.jsx';
import questionsForLesson from './lesson.jsx';

const Lessons = React.createClass({

  createNew() {
    this.props.dispatch(actions.toggleNewLessonModal());
  },

  submitNewLesson(data) {
    this.props.dispatch(actions.submitNewLesson(data));
    // this.props.dispatch(actions.toggleNewLessonModal())
  },

  renderLessons() {
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
            <li key={q[question].key} className="menu-list"><div className="column">
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
          <Link to={`/play/lesson/${key}`} className="menu-label" activeClassName="is-active">{data[key].name}</Link>
          <Link to={`/play/lesson/${key}`} className="menu-label is-pulled-right" activeClassName="is-active">Start Activity</Link>
        </div>
        <ul>{questionsToDisplay}</ul>
      </li>);
    });
  },

  renderModal() {
    const stateSpecificClass = this.props.lessons.submittingnew ? 'is-loading' : '';
    if (this.props.lessons.newLessonModalOpen) {
      return (
        <Modal close={this.createNew}>
          <EditLessonForm submit={this.submitNewLesson} renderQuestionSelect={this.renderQuestionSelect} stateSpecificClass={stateSpecificClass} />
        </Modal>
      );
    }
  },

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
  },

});

function select(state) {
  return {
    lessons: state.lessons,
    routing: state.routing,
    questions: state.questions,
  };
}

export default connect(select)(Lessons);
