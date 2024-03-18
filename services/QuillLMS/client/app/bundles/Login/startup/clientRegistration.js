import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';
import LoginFormApp from './LoginFormAppClient.jsx';
import PremiumFooterApp from '../../Teacher/startup/PremiumFooterAppClient.jsx';

ReactOnRails.register({ LoginFormApp, PremiumFooterApp});
