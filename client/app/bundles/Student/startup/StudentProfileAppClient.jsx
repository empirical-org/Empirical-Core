import React from 'react';
import StudentProfile from '../../HelloWorld/containers/StudentProfile.jsx';
import { Provider } from 'react-redux'
import studentProfile from '../../../reducers/student_profile.js'
import { createStore } from 'redux';

export default () => (
  <Provider store={createStore(studentProfile)}>
    <StudentProfile />
  </Provider>
);
