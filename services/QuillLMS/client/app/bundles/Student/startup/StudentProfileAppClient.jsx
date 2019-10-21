import React from 'react';
import StudentProfile from '../../Teacher/containers/StudentProfile.jsx';
import { Provider } from 'react-redux';
import studentProfile from '../../../reducers/student_profile';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const store = createStore(studentProfile, applyMiddleware(thunk));

export default props => (
  <Provider store={store}>
    <StudentProfile
      classroomId={props && props.params ? props.params.classroomId : null}
      router={props.router}
    />
  </Provider>
);
