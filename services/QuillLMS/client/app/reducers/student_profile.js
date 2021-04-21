import { TO_DO_ACTIVITIES, } from '../constants/student_profile'

const initialState = {
  classrooms: [],
  selectedClassroomId: null,
  showDropdown: false,
  notifications: [],
  numberOfClassroomTabs: 1,
  loading: true,
  scores: null,
  student: null,
  nextActivitySession: null,
  activeClassworkTab: TO_DO_ACTIVITIES
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'HANDLE_CLASSROOM_CLICK':
      return Object.assign({}, state, {
        loading: true,
        selectedClassroomId: action.selectedClassroomId
      });
    case 'RECEIVE_NOTIFICATIONS':
      return Object.assign({}, state, { notifications: action.notifications });
    case 'RECEIVE_STUDENTS_CLASSROOMS':
      return Object.assign({}, state, { classrooms: action.classrooms });
    case 'RECEIVE_STUDENT_PROFILE':
      return Object.assign({}, state, {
        loading: false,
        scores: action.data.scores,
        student: action.data.student,
        nextActivitySession: action.data.next_activity_session,
        selectedClassroomId: action.data.classroom_id
      });
    case 'UPDATE_ACTIVE_CLASSWORK_TAB':
      return Object.assign({}, state, { activeClassworkTab: action.activeClassworkTab });
    default:
      return state;
  }
};
