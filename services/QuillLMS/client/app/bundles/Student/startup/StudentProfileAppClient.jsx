import React from 'react';
import StudentProfile from '../../Teacher/containers/StudentProfile.jsx';
import { Provider } from 'react-redux';
import studentProfile from '../../../reducers/student_profile';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

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
