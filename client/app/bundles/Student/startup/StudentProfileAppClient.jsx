import React from 'react'
import StudentProfile from '../../HelloWorld/containers/StudentProfile.jsx'
import { Provider } from 'react-redux'
import studentProfile from '../../../reducers/student_profile'
import studentsClassroomsHeader from '../../../reducers/students_classrooms_header'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const rootReducer = combineReducers({ studentProfile, studentsClassroomsHeader });
const store = createStore(rootReducer, applyMiddleware(thunk));

export default () => (
  <Provider store={store}>
    <StudentProfile />
  </Provider>
);
