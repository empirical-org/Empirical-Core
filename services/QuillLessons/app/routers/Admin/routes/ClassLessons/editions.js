import ShowEditions from 'components/classroomLessons/admin/allUserEditions';
import Passthrough from 'components/shared/passthrough';

export default {
  path: 'editions',
  component: Passthrough,
  indexRoute: {
    component: ShowEditions,
  }
};
