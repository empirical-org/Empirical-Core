import ReactOnRails from 'react-on-rails';
import HelloWorldApp from './HelloWorldAppClient';
import DashboardApp from './DashboardAppClient';
import LessonPlannerApp from './LessonPlannerAppClient';
import TeacherGuideApp from './TeacherGuideClient';
// This is how react_on_rails can see the HelloWorldApp in the browser.
ReactOnRails.register({ TeacherGuideApp, HelloWorldApp, DashboardApp, LessonPlannerApp});
