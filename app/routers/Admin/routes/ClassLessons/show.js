import ShowClassroomLesson from 'components/classroomLessons/admin/show';
import ShowClassroomLessonSlide from 'components/classroomLessons/admin/showSlide';
import Passthrough from 'components/shared/passthrough';
// import showSlide from './showSlide';

export default {
  path: ':classroomLessonID',
  component: Passthrough,
  indexRoute: {
    component: ShowClassroomLesson,
  },
  childRoutes: [
    {
      path: 'slide/:slideID',
      component: ShowClassroomLessonSlide,
    }
  ],
};
