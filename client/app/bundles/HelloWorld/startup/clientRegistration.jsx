import ReactOnRails from 'react-on-rails';
import HelloWorldApp from './HelloWorldAppClient';
import DashboardApp from './DashboardAppClient';
import LessonPlannerApp from './LessonPlannerAppClient';
import TeacherGuideApp from './TeacherGuideClient';
import TeacherAccountApp from './TeacherAccountAppClient';
import NewAccountApp from './NewAccountAppClient';
import ScorebookApp from './ScorebookAppClient';
import PremiumPricingGuideApp from './PremiumPricingGuideAppClient';
import ProgressReportApp from './ProgressReportAppClient';
import StudentProfileApp from './StudentProfileAppClient';
import ArchivedClassroomsManagerApp from './ArchivedClassroomsManagerAppClient'
import ResultsPageApp from './ResultsPageAppClient'
import AdminDashboardApp from './AdminDashboardAppClient'
import AdminAccountsApp from './AdminAccountsAppClient'
import AdminsEditorApp from './AdminsEditorAppClient'
import JoinClassApp from './JoinClassAppClient'
import PublicActivityPacksApp from './PublicActivityPacksAppClient.jsx'
import AddStudentApp from './AddStudentAppClient.jsx'
import DiagnosticReportsApp from './DiagnosticReportsAppClient.jsx'
import DiagnosticPlannerApp from './DiagnosticPlannerAppClient.jsx'
import CreateClassApp from './CreateClassAppClient.jsx'
import UnitTemplatesApp from './UnitTemplatesClient.jsx'


// This is how react_on_rails can see the HelloWorldApp in the browser.

ReactOnRails.register({ TeacherGuideApp, HelloWorldApp, DashboardApp,
  LessonPlannerApp, TeacherAccountApp, NewAccountApp, ScorebookApp,
  PremiumPricingGuideApp, ProgressReportApp, StudentProfileApp,
  ArchivedClassroomsManagerApp, ResultsPageApp, AdminDashboardApp, AdminAccountsApp,
  AdminsEditorApp, JoinClassApp, PublicActivityPacksApp, AddStudentApp,
  DiagnosticPlannerApp, DiagnosticReportsApp, CreateClassApp, UnitTemplatesApp});
