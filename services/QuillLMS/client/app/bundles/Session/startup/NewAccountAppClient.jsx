import React from 'react';
import { withSegmentMetricsProps } from '../../../modules/metrics';

import NewAccount from '../../Teacher/components/accounts/new/new_account_stage1.jsx';

const NewAccountApp = React.createClass({
  render: function() {
    return (
      <NewAccount {...this.props} />
    )
  }
});

const NewAccountAppWithMetrics = withSegmentMetricsProps(NewAccountApp);

export default NewAccountAppWithMetrics
