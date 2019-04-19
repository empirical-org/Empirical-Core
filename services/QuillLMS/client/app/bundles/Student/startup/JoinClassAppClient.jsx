import React from 'react';
import { withSegmentMetricsProps } from '../../../modules/metrics';
import JoinClass from '../../Teacher/containers/JoinClass.jsx';

class JoinClassApp extends React.Component {
  render() {
    return <JoinClass {...this.props} />
  }
}

const JoinClassAppWithMetrics = withSegmentMetricsProps(JoinClassApp);

export default JoinClassAppWithMetrics
