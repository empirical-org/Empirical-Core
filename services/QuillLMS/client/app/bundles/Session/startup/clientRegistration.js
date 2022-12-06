import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';
import NewAccountApp from './NewAccountAppClient.jsx';
import FinishSetUpApp from './FinishSetUpAppClient';

ReactOnRails.register({ NewAccountApp, FinishSetUpApp, });
