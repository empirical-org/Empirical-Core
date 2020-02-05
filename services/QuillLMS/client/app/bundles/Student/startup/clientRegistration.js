import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';
import JoinClassApp from './JoinClassAppClient';
import AccountSettingsApp from './AccountSettingsAppClient';
import StudentProfileApp from './StudentProfileAppClient';
import StudentProfileRouter from './StudentProfileRouter';
import StudentNavbarDropdown from './StudentNavbarDropdownAppClient'

ReactOnRails.register({
  StudentProfileApp,
  JoinClassApp,
  AccountSettingsApp,
  StudentProfileRouter,
  StudentNavbarDropdown
});
