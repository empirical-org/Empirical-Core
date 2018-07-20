import ShowEditions from 'components/classroomLessons/admin/allUserEditions';
import Passthrough from 'quill-component-library/dist/componentLibrary';

export default {
  path: 'editions',
  component: Passthrough,
  indexRoute: {
    component: ShowEditions,
  }
};
