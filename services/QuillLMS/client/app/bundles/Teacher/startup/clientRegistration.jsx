import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';

import ActivityClassificationsApp from './ActivityClassificationsAppClient';
import AdminAccessApp from './AdminAccessAppClient';
import AdminAccountsApp from './AdminAccountsAppClient';
import AdminDashboardApp from './AdminDashboardAppClient';
import AdminsEditorApp from './AdminsEditorAppClient';
import AnnouncementsApp from './AnnouncementsAppClient';
import ApApp from './ApAppClient';
import AssignActivitiesApp from './AssignActivitiesAppClient';
import BlogPostsApp from './BlogPostsAppClient';
import CmsActivitiesAppClient from './CmsActivitiesAppClient';
import CmsDistrictIndexApp from './CmsDistrictIndexAppClient';
import CmsSchoolIndexApp from './CmsSchoolIndexAppClient';
import CmsUserIndexApp from './CmsUserIndexAppClient';
import DashboardApp from './DashboardAppClient';
import DemoAccountBanner from './DemoAccountBannerAppClient';
import DiagnosticReportsApp from './DiagnosticReportsAppClient.jsx';
import ExpandableUnitSection from './ExpandableUnitClient';
import ForgotPasswordApp from './ForgotPasswordAppClient';
import LessonPlannerApp from './LessonPlannerAppClient';
import PreApApp from './PreApAppClient';
import PremiumPricingGuideApp from './PremiumPricingGuideAppClient';
import PressApp from './PressAppClient';
import ProgressReportApp from './ProgressReportAppClient';
import PublicActivityPacksApp from './PublicActivityPacksAppClient.jsx';
import PublicUnitTemplatesApp from './PublicUnitTemplatesAppClient.jsx';
import QuestionsAndAnswersSection from './QuestionsAndAnswersClient';
import ResetPasswordApp from './ResetPasswordAppClient';
import ResultsPageApp from './ResultsPageAppClient';
import SalesFormApp from './SalesFormAppClient';
import ScorebookApp from './ScorebookAppClient';
import SpringBoardApp from './SpringBoardAppClient.tsx';
import SubscriptionApp from './SubscriptionAppClient';
import TeacherAccountApp from './TeacherAccountAppClient';
import TeacherClassroomsApp from './TeacherClassroomsAppClient';
import TeacherFixApp from './TeacherFixAppClient';
import TeacherGuideApp from './TeacherGuideClient';
import TutorialsApp from './TutorialsAppClient';
import UnitTemplateCategoriesApp from './UnitTemplateCategoriesAppClient';

import LockerApp from '../../Staff/startup/lockerAppClient';
import UploadRostersApp from '../../Staff/startup/UploadRostersAppClient';
import StudentFeedbackModal from '../../Student/startup/StudentFeedbackModalAppClient';
import StudentNavbarItems from '../../Student/startup/StudentNavbarItemsAppClient';

import '../styles/styles.scss';

require('../../../assets/styles/home.scss');

// This is how react_on_rails can see the TeacherApp in the browser.

ReactOnRails.register({ TeacherGuideApp,
  DashboardApp,
  LessonPlannerApp,
  TeacherAccountApp,
  ScorebookApp,
  PremiumPricingGuideApp,
  ProgressReportApp,
  ResultsPageApp,
  AdminDashboardApp,
  AdminAccountsApp,
  AdminsEditorApp,
  PublicActivityPacksApp,
  DiagnosticReportsApp,
  PublicUnitTemplatesApp,
  AssignActivitiesApp,
  TutorialsApp,
  TeacherFixApp,
  ActivityClassificationsApp,
  SubscriptionApp,
  BlogPostsApp,
  PressApp,
  AnnouncementsApp,
  CmsActivitiesAppClient,
  CmsUserIndexApp,
  CmsSchoolIndexApp,
  CmsDistrictIndexApp,
  ResetPasswordApp,
  ForgotPasswordApp,
  TeacherClassroomsApp,
  UnitTemplateCategoriesApp,
  StudentNavbarItems,
  ExpandableUnitSection,
  QuestionsAndAnswersSection,
  PreApApp,
  ApApp,
  SpringBoardApp,
  StudentFeedbackModal,
  UploadRostersApp,
  LockerApp,
  SalesFormApp,
  DemoAccountBanner,
  AdminAccessApp
});
