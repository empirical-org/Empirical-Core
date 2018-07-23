import AdminClassroomLessonsContainer from 'components/classroomLessons/admin/container';
import ClassroomLessonsIndex from 'components/classroomLessons/admin/index';

export default {
  path: 'classroom-lessons',
  component: AdminClassroomLessonsContainer,
  indexRoute: {
    component: ClassroomLessonsIndex,
  },
  getChildRoutes: (partialNextState, cb) => {
    Promise.all([
      import('./editions.js'),
      import('./show.js')
    ])
    .then(modules => cb(null, modules.map(module => module.default)))
    .catch(err => console.error('Dynamic page loading failed', err));
  },

};
