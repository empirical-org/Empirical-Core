import * as React from 'react';
import { Route, Switch, withRouter, RouteComponentProps } from "react-router-dom";
import { connect } from 'react-redux';
import * as proofreaderActivitiesActions from '../../actions/proofreaderActivities'
import * as conceptsActions from '../../actions/concepts'
import Lessons from '../lessons/lessons'
import Lesson from '../lessons/lesson'
import Concepts from '../concepts/concepts'
// import Concept from '../concepts/concept'
import TabLink from './tabLink'

interface PathParamsType {
  [key: string]: string,
}

type AdminContainerProps = RouteComponentProps<PathParamsType> & { dispatch: Function }

class AdminContainer extends React.Component<AdminContainerProps> {
  constructor(props: AdminContainerProps) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(proofreaderActivitiesActions.startListeningToActivities());
    this.props.dispatch(conceptsActions.startListeningToConcepts());
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
              <TabLink activeClassName="is-active" to={'/admin/lessons'}>Proofreader Activities</TabLink>
            </ul>
            <p className="menu-label">
              Supporting
            </p>
            <ul className="menu-list">
              <TabLink activeClassName="is-active" to={'/admin/concepts'}>Concepts</TabLink>
            </ul>
          </aside>
          <div className="admin-container">
            {this.props.children}
          </div>
        </section>
        <Switch>
          <Route component={Lesson} path={`/admin/lessons/:lessonID`} />
          <Route component={Lessons} path={`/admin/lessons`} />
          <Route component={Concepts} path={`/admin/concepts`} />
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
