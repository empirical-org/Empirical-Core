import * as React from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from 'react-redux';
import * as grammarActivitiesActions from '../../actions/grammarActivities'
import * as questionsActions from '../../actions/questions'
import * as conceptsActions from '../../actions/concepts'
import * as conceptsFeedbackActions from '../../actions/conceptsFeedback'
import * as questionAndConceptMapActions from '../../actions/questionAndConceptMap'
import Questions from '../questions/questions'
import Question from '../questions/question'
import Lessons from '../lessons/lessons'
import Lesson from '../lessons/lesson'
import Concepts from '../concepts/concepts'
import Concept from '../concepts/concept'
import ConceptsFeedback from '../conceptsFeedback/conceptsFeedback'
import ConceptFeedback from '../conceptsFeedback/conceptFeedback'
import QuestionDashboard from '../dashboards/questionDashboard'
import ConceptDashboard from '../dashboards/conceptDashboard'
import TabLink from './tabLink'

const usersEndpoint = `${import.meta.env.VITE_DEFAULT_URL}/api/v1/users.json`;
const newSessionEndpoint = `${import.meta.env.VITE_DEFAULT_URL}/session/new`;

interface PathParamsType {
  [key: string]: string,
}

type AdminContainerProps = RouteComponentProps<PathParamsType> & { dispatch: Function }

class AdminContainer extends React.Component<AdminContainerProps> {
  constructor(props: AdminContainerProps) {
    super(props)
  }

  UNSAFE_componentWillMount() {
    this.fetchUser().then(userData => {
      if (userData.user === null || (userData.hasOwnProperty('role') && userData.user.role !== 'staff')) {
        window.location = newSessionEndpoint;
      }
    }
    );
    this.props.dispatch(questionsActions.startListeningToQuestions());
    this.props.dispatch(grammarActivitiesActions.startListeningToActivities());
    this.props.dispatch(conceptsActions.startListeningToConcepts());
    this.props.dispatch(conceptsFeedbackActions.startListeningToConceptsFeedback());
    this.props.dispatch(questionAndConceptMapActions.startListeningToQuestionAndConceptMapData());
  }

  async fetchUser() {
    return fetch(usersEndpoint, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    });
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
              <TabLink activeClassName="is-active" to="/admin/lessons">Grammar Activities</TabLink>
              <TabLink activeClassName="is-active" to="/admin/question_dashboard">Question Dashboard</TabLink>
              <TabLink activeClassName="is-active" to="/admin/concept_dashboard">Concept Dashboard</TabLink>
            </ul>
            <p className="menu-label">
              Questions
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to="/admin/questions">Questions</TabLink>
            </ul>
            <p className="menu-label">
              Supporting
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to="/admin/concepts">Concepts</TabLink>
              <TabLink activeClassName="is-active" to="/admin/concepts_feedback">Concept Feedback</TabLink>
            </ul>
          </aside>
          <div className="admin-container">
            {this.props.children}
          </div>
        </section>
        <Switch>
          <Route component={Lesson} path="/admin/lessons/:lessonID" />
          <Route component={Lessons} path="/admin/lessons" />
          <Route component={Question} path="/admin/questions/:questionID" />
          <Route component={Questions} path="/admin/questions" />
          <Route component={Concept} path="/admin/concepts/:conceptID" />
          <Route component={Concepts} path="/admin/concepts" />
          <Route component={ConceptFeedback} path="/admin/concepts_feedback/:conceptFeedbackID" />
          <Route component={ConceptsFeedback} path="/admin/concepts_feedback" />
          <Route component={QuestionDashboard} path="/admin/question_dashboard" />
          <Route component={ConceptDashboard} path="/admin/concept_dashboard" />
        </Switch>
      </div>
    );
  }
}

function select(state) {
  return {
  };
}

function mergeProps(stateProps: Object, dispatchProps: Object, ownProps: Object) {
  return {...ownProps, ...stateProps, ...dispatchProps}
}

export default withRouter(connect(select, dispatch => ({dispatch}), mergeProps)(AdminContainer));
