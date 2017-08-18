import ClassroomLessonsIndex from 'components/classroomLessons/admin/index';

export default {
  path: 'classroom-lessons',
  indexRoute: {
    component: ClassroomLessonsIndex,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      // System.import('./lesson.js'),
      // System.import('./lessonResults.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
