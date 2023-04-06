import * as React from "react";
import { useQuery } from 'react-query';
import { NavLink, Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Rules from './rules';

import { ALL, BECAUSE, BUT, SO } from '../../../../../constants/evidence';
import { Error, Spinner } from '../../../../Shared/index';
import { getPromptForComponent } from '../../../helpers/evidence/promptHelpers';
import { renderHeader } from '../../../helpers/evidence/renderHelpers';
import { fetchActivity } from '../../../utils/evidence/activityAPIs';

const RulesIndexRouter = ({ history, match }) => {
  const { params } = match;
  const { activityId } = params;

  // get cached activity data to pass to rule
  const { data: activityData } = useQuery({
    queryKey: [`activity-${activityId}`, activityId],
    queryFn: fetchActivity
  });

  if(!activityData) {
    return(
      <div className="loading-spinner-container">
        <Spinner />
      </div>
    );
  }

  if(activityData.error) {
    return(
      <div className="error-container">
        <Error error={activityData.error} />
      </div>
    );
  }

  return(
    <div className="session-view-container">
      {renderHeader(activityData, 'View All Rules')}
      <div className="tabs-container">
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/rules-index/all`}>
          <div className="tab-option">
            All Rules
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/rules-index/because`}>
          <div className="tab-option">
            Because Rules
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/rules-index/but`}>
          <div className="tab-option">
            But Rules
          </div>
        </NavLink>
        <NavLink activeClassName="is-active" to={`/activities/${activityId}/rules-index/so`}>
          <div className="tab-option">
            So Rules
          </div>
        </NavLink>
      </div>
      <Switch>
        <Redirect exact from='/activities/:activityId/rules-index' to='/activities/:activityId/rules-index/all' />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route path='/activities/:activityId/rules-index/all' render={() => <Rules activityId={activityId} history={history} prompt={getPromptForComponent(activityData, ALL)} />} />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route path='/activities/:activityId/rules-index/because' render={() => <Rules activityId={activityId} history={history} prompt={getPromptForComponent(activityData, BECAUSE)} />} />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route path='/activities/:activityId/rules-index/but' render={() => <Rules activityId={activityId} history={history} prompt={getPromptForComponent(activityData, BUT)} />} />
        {/* eslint-disable-next-line react/jsx-no-bind */}
        <Route path='/activities/:activityId/rules-index/so' render={() => <Rules activityId={activityId} history={history} prompt={getPromptForComponent(activityData, SO)} />} />
      </Switch>
    </div>
  );
}

export default withRouter(RulesIndexRouter)
