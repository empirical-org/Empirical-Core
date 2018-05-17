import ReactOnRails from 'react-on-rails';
import JoinClassApp from './JoinClassAppClient';
import AccountSettingsApp from './AccountSettingsAppClient';
import StudentProfileApp from './StudentProfileAppClient.jsx';
import StudentProfileRouter from './StudentProfileRouter.jsx'

ReactOnRails.register({ StudentProfileApp, JoinClassApp, AccountSettingsApp, StudentProfileRouter});
