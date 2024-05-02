import { TO_DO_ACTIVITIES, } from '../constants/student_profile';

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
  activeClassworkTab: TO_DO_ACTIVITIES,
  exactScoresDataPending: false
};

export default (state, action) => {
  state = state || initialState;

  switch(action.type) {
    case 'HANDLE_CLASSROOM_CLICK':
      return Object.assign({}, state, {
        loading: true,
        exactScoresDataPending: false,
        selectedClassroomId: action.selectedClassroomId
      });
    case 'RECEIVE_STUDENTS_CLASSROOMS':
      return Object.assign({}, state, { classrooms: action.classrooms });
    case 'RECEIVE_STUDENT_PROFILE':
      return Object.assign({}, state, {
        loading: false,
        scores: action.data.scores,
        student: action.data.student,
        nextActivitySession: action.data.next_activity_session,
        selectedClassroomId: action.data.classroom_id,
        metrics: action.data.metrics,
        showExactScores: action.data.show_exact_scores,
        exactScoresDataPending: true
      });
    case 'RECEIVE_EXACT_SCORES_DATA': {
      return Object.assign({}, state, {
        exactScoresDataPending: false,
        exactScoresData: action.data.exact_scores_data
      })
    }
    case 'UPDATE_ACTIVE_CLASSWORK_TAB':
      return Object.assign({}, state, { activeClassworkTab: action.activeClassworkTab });
    default:
      return state;
  }
};
