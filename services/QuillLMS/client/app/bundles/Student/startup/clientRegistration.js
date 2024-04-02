import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';
import AccountSettingsApp from './AccountSettingsAppClient';
import JoinClassApp from './JoinClassAppClient';
import StudentFeedbackModal from './StudentFeedbackModalAppClient';
import StudentNavbarItems from './StudentNavbarItemsAppClient';
import StudentProfileApp from './StudentProfileAppClient';
import StudentProfileRouter from './StudentProfileRouter';

ReactOnRails.register({
  StudentProfileApp,
  JoinClassApp,
  AccountSettingsApp,
  StudentProfileRouter,
  StudentNavbarItems,
  StudentFeedbackModal
});
