import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import FinishSetUpApp from './FinishSetUpAppClient';
import NewAccountApp from './NewAccountAppClient.jsx';

import PremiumFooterApp from '../../Footer/startup/PremiumFooterAppClient.jsx';


ReactOnRails.register({ NewAccountApp, FinishSetUpApp, PremiumFooterApp});
