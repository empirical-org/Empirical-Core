import React from 'react'
import ResetPassword from '../components/accounts/reset_password/reset_password'
import { withSegmentMetricsProps } from '../../../modules/metrics';

function ResetPasswordApp (props) {
  return (<ResetPassword {...props} />);
}

const ResetPasswordAppWithMetrics = withSegmentMetricsProps(ResetPasswordApp);

export default ResetPasswordAppWithMetrics
