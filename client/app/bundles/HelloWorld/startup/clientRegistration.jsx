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
// This is how react_on_rails can see the HelloWorldApp in the browser.

ReactOnRails.register({ TeacherGuideApp, HelloWorldApp, DashboardApp, LessonPlannerApp, TeacherAccountApp, NewAccountApp, ScorebookApp, PremiumPricingGuideApp, ProgressReportApp});
