import ShowClassroomLesson from 'components/classroomLessons/admin/show';
import ShowAdminEdition from 'components/classroomLessons/admin/showAdminEdition'
import ShowEditionSlide from 'components/classroomLessons/admin/showSlide';
import ShowEditionScriptItem from 'components/classroomLessons/admin/showScriptItem';
import ShowClassroomLessonUserEditions from 'components/classroomLessons/admin/userEditions';
import Passthrough from 'quill-component-library/dist/componentLibrary';

export default {
  path: ':classroomLessonID',
  component: Passthrough,
  indexRoute: {
    component: ShowClassroomLesson,
  },
  childRoutes: [
    {
      path: 'editions',
      component: ShowClassroomLessonUserEditions
    },
    {
      path: 'editions/:editionID',
      component: ShowAdminEdition
    },
    {
      path: 'editions/:editionID/slide/:slideID',
      component: ShowEditionSlide,
    },
    {
      path: 'editions/:editionID/slide/:slideID/scriptItem/:scriptItemID',
      component: ShowEditionScriptItem,
    }
  ],
};
