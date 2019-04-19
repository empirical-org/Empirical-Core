import React from 'react'
import ForgotPassword from '../components/accounts/reset_password/forgot_password'
import { withSegmentMetricsProps } from '../../../modules/metrics';

function ForgotPasswordApp (props) { return (<ForgotPassword {...props} />); }

const ForgotPasswordAppWithMetrics = withSegmentMetricsProps(ForgotPasswordApp);

export default ForgotPasswordAppWithMetrics
