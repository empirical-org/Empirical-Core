import * as React from 'react';
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import * as grammarActivitiesActions from '../../actions/grammarActivities'
import * as questionsActions from '../../actions/questions'
import * as conceptsActions from '../../actions/concepts'
import * as conceptsFeedbackActions from '../../actions/conceptsFeedback'
import Questions from '../questions/questions'
import Question from '../questions/question'
import Lessons from '../lessons/lessons'
import Lesson from '../lessons/lesson'
import Concepts from '../concepts/concepts'
import Concept from '../concepts/concept'
import ConceptsFeedback from '../conceptsFeedback/conceptsFeedback'
import ConceptFeedback from '../conceptsFeedback/conceptFeedback'
import TabLink from './tabLink'

class adminContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(questionsActions.startListeningToQuestions());
    this.props.dispatch(grammarActivitiesActions.startListeningToActivities());
    this.props.dispatch(conceptsActions.startListeningToConcepts());
    this.props.dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
  }

  render() {
    return (
      <div style={{ display: 'flex', backgroundColor: "white", height: '100vw' }}>
        <section className="section is-fullheight" style={{ display: 'flex', flexDirection: 'row', paddingTop: 0, paddingBottom: 0, }}>
          <aside className="menu" style={{ minWidth: 220, borderRight: '1px solid #e3e3e3', padding: 15, paddingLeft: 0, }}>
            <p className="menu-label">
              General
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/lessons'} activeClassName="is-active">Grammar Activities</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/questions'} activeClassName="is-active">Questions</TabLink>
            </ul>
            <p className="menu-label">
              Supporting
            </p>
            <ul className="menu-list">
              <TabLink to={'/admin/concepts'} activeClassName="is-active">Concepts</TabLink>
              <TabLink to={'/admin/concepts_feedback'} activeClassName="is-active">Concept Feedback</TabLink>
            </ul>
          </aside>
          <div className="admin-container">
            {this.props.children}
          </div>
        </section>
        <Switch>
          <Route path={`/admin/lessons/:lessonID`} component={Lesson}/>
          <Route path={`/admin/lessons`} component={Lessons}/>
          <Route path={`/admin/questions/:questionID`} component={Question}/>
          <Route path={`/admin/questions`} component={Questions}/>
          <Route path={`/admin/concepts/:conceptID`} component={Concept}/>
          <Route path={`/admin/concepts`} component={Concepts}/>
          <Route path={`/admin/concepts_feedback/:conceptFeedbackID`} component={ConceptFeedback}/>
          <Route path={`/admin/concepts_feedback`} component={ConceptsFeedback}/>
        </Switch>
      </div>
    );
  }
}

function select(state) {
  return {
  };
}

export default withRouter(connect(select)(adminContainer));
