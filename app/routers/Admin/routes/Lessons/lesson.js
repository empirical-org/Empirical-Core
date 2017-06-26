import Lesson from 'components/lessons/lesson.jsx';
import LessonResults from 'components/lessons/lessonResults.jsx';

const lessonResultsRoute = {
  path: 'results',
  component: LessonResults,
};

export default {
  path: ':lessonID',
  component: Lesson,
  childRoutes: [
    lessonResultsRoute
  ],
};