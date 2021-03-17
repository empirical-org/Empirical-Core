import * as React from "react";
import { withRouter, Link } from 'react-router-dom';

const Model = ({ history, match }) => {
  const { params } = match;
  const { activityId, modelId } = params;

  return(
    <div className="model-container">
      <Link id="semantic-index-return" to={{ pathname: `/activities/${activityId}/semantic-rules`, state: 'returned-to-index' }}>← Return to Semantic Rules Index</Link>
    </div>
  );
}

export default withRouter(Model)
