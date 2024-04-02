import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import studentProfile from '../../../reducers/student_profile';
import StudentProfile from '../../Teacher/containers/StudentProfile.jsx';

const store = createStore(studentProfile, applyMiddleware(thunk));

const StudentProfileAppClient = ({ match, history, isBeingPreviewed, }) => (
  <Provider store={store}>
    <StudentProfile
      classroomId={match && match.params ? match.params.classroomId : null}
      history={history}
      isBeingPreviewed={isBeingPreviewed}
    />
  </Provider>
);

export default StudentProfileAppClient
