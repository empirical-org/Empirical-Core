import ReactOnRails from 'react-on-rails';
import DashboardApp from './DashboardAppClient';
import LessonPlannerApp from './LessonPlannerAppClient';
import TeacherGuideApp from './TeacherGuideClient';
import TeacherAccountApp from './TeacherAccountAppClient';
import ScorebookApp from './ScorebookAppClient';
import PremiumPricingGuideApp from './PremiumPricingGuideAppClient';
import ProgressReportApp from './ProgressReportAppClient';
import ArchivedClassroomsManagerApp from './ArchivedClassroomsManagerAppClient';
import ResultsPageApp from './ResultsPageAppClient';
import AdminDashboardApp from './AdminDashboardAppClient';
import AdminAccountsApp from './AdminAccountsAppClient';
import AdminsEditorApp from './AdminsEditorAppClient';
import PublicActivityPacksApp from './PublicActivityPacksAppClient.jsx';
import AddStudentApp from './AddStudentAppClient.jsx';
import DiagnosticReportsApp from './DiagnosticReportsAppClient.jsx';
import DiagnosticPlannerApp from './DiagnosticPlannerAppClient.jsx';
import CreateClassApp from './CreateClassAppClient.jsx';
import UnitTemplatesApp from './UnitTemplatesClient.jsx';
import PublicUnitTemplatesApp from './PublicUnitTemplatesAppClient.jsx';
import GoogleSyncApp from './GoogleSyncAppClient.jsx';
import GoogleMismatchApp from './GoogleMismatchAppClient.jsx';
import AssignActivitiesApp from './AssignActivitiesAppClient';
import TutorialsApp from './TutorialsAppClient';
import TeacherFixApp from './TeacherFixAppClient';
import ActivityCategoriesApp from './ActivityCategoriesAppClient';
import ActivityCategoryApp from './ActivityCategoryAppClient';
import ActivityClassificationsApp from './ActivityClassificationsAppClient';
import EditCoteacherApp from './EditCoteacherAppClient';
import EditStudentApp from './EditStudentAppClient';
import SelectSchoolApp from './SelectSchoolAppClient';
import SubscriptionApp from './SubscriptionAppClient';
import BlogPostsApp from './BlogPostsAppClient'
import PressApp from './PressAppClient'
import AnnouncementsApp from './AnnouncementsAppClient'
import CmsIndexTableApp from './CmsIndexTableAppClient'

require('../../../assets/styles/home.scss');

// This is how react_on_rails can see the HelloWorldApp in the browser.

ReactOnRails.register({ TeacherGuideApp,
  DashboardApp,
  LessonPlannerApp,
  TeacherAccountApp,
  ScorebookApp,
  PremiumPricingGuideApp,
  ProgressReportApp,
  ArchivedClassroomsManagerApp,
  ResultsPageApp,
  AdminDashboardApp,
  AdminAccountsApp,
  AdminsEditorApp,
  PublicActivityPacksApp,
  AddStudentApp,
  DiagnosticPlannerApp,
  DiagnosticReportsApp,
  CreateClassApp,
  UnitTemplatesApp,
  PublicUnitTemplatesApp,
  GoogleSyncApp,
  GoogleMismatchApp,
  AssignActivitiesApp,
  TutorialsApp,
  TeacherFixApp,
  ActivityCategoriesApp,
  ActivityCategoryApp,
  ActivityClassificationsApp,
  EditCoteacherApp,
  EditStudentApp,
  SelectSchoolApp,
  SubscriptionApp,
  BlogPostsApp,
  PressApp,
  AnnouncementsApp,
  CmsIndexTableApp
});
