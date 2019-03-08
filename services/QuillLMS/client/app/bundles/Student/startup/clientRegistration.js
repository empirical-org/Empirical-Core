import ReactOnRails from 'react-on-rails';
import JoinClassApp from './JoinClassAppClient';
import AccountSettingsApp from './AccountSettingsAppClient';
import StudentProfileApp from './StudentProfileAppClient';
import StudentProfileRouter from './StudentProfileRouter';

ReactOnRails.register({
  StudentProfileApp,
  JoinClassApp,
  AccountSettingsApp,
  StudentProfileRouter,
});
