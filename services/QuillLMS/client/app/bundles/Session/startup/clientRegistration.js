import ReactOnRails from 'react-on-rails';
import NewAccountApp from './NewAccountAppClient.jsx';
import { withSegmentMetricsProps } from '../../../modules/metrics';

const NewAccountAppWithMetrics = withSegmentMetricsProps(NewAccountApp);

ReactOnRails.register({ NewAccountAppWithMetrics, });
