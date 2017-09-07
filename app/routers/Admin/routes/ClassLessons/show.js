import ShowClassroomLesson from 'components/classroomLessons/admin/show';
import ShowClassroomLessonSlide from 'components/classroomLessons/admin/showSlide';
import ShowClassroomLessonScriptItem from 'components/classroomLessons/admin/showScriptItem';
import Passthrough from 'components/shared/passthrough';

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
    },
    {
      path: 'slide/:slideID/scriptItem/:scriptItemID',
      component: ShowClassroomLessonScriptItem,
    }
  ],
};
