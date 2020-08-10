import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import ReactOnRails from 'react-on-rails';
import DashboardApp from './DashboardAppClient';
import LessonPlannerApp from './LessonPlannerAppClient';
import TeacherGuideApp from './TeacherGuideClient';
import TeacherAccountApp from './TeacherAccountAppClient';
import ScorebookApp from './ScorebookAppClient';
import PremiumPricingGuideApp from './PremiumPricingGuideAppClient';
import ProgressReportApp from './ProgressReportAppClient';
import ResultsPageApp from './ResultsPageAppClient';
import AdminDashboardApp from './AdminDashboardAppClient';
import AdminAccountsApp from './AdminAccountsAppClient';
import AdminsEditorApp from './AdminsEditorAppClient';
import PublicActivityPacksApp from './PublicActivityPacksAppClient.jsx';
import DiagnosticReportsApp from './DiagnosticReportsAppClient.jsx';
import UnitTemplatesApp from './UnitTemplatesClient.jsx';
import PublicUnitTemplatesApp from './PublicUnitTemplatesAppClient.jsx';
import AssignActivitiesApp from './AssignActivitiesAppClient';
import TutorialsApp from './TutorialsAppClient';
import TeacherFixApp from './TeacherFixAppClient';
import ActivityCategoriesApp from './ActivityCategoriesAppClient';
import ActivityCategoryApp from './ActivityCategoryAppClient';
import ActivityClassificationsApp from './ActivityClassificationsAppClient';
import SubscriptionApp from './SubscriptionAppClient';
import BlogPostsApp from './BlogPostsAppClient'
import PressApp from './PressAppClient'
import AnnouncementsApp from './AnnouncementsAppClient'
import CmsUserIndexApp from './CmsUserIndexAppClient'
import CmsSchoolIndexApp from './CmsSchoolIndexAppClient'
import ForgotPasswordApp from './ForgotPasswordAppClient'
import ResetPasswordApp from './ResetPasswordAppClient'
import TeacherClassroomsApp from './TeacherClassroomsAppClient'
import UnitTemplateCategoriesApp from './UnitTemplateCategoriesAppClient'
import StudentNavbarItems from '../../Student/startup/StudentNavbarItemsAppClient'
import ExpandableUnitSection from './ExpandableUnitClient'
import QuestionsAndAnswersSection from './QuestionsAndAnswersClient';
import PreAp from './PreApAppClient';
import Ap from './ApAppClient';

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
  UnitTemplatesApp,
  PublicUnitTemplatesApp,
  AssignActivitiesApp,
  TutorialsApp,
  TeacherFixApp,
  ActivityCategoriesApp,
  ActivityCategoryApp,
  ActivityClassificationsApp,
  SubscriptionApp,
  BlogPostsApp,
  PressApp,
  AnnouncementsApp,
  CmsUserIndexApp,
  CmsSchoolIndexApp,
  ResetPasswordApp,
  ForgotPasswordApp,
  TeacherClassroomsApp,
  UnitTemplateCategoriesApp,
  StudentNavbarItems,
  ExpandableUnitSection,
  QuestionsAndAnswersSection,
  PreAp,
  Ap
});
