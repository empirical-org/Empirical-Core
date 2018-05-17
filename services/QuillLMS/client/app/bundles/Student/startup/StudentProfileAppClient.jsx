import React from 'react'
import StudentProfile from '../../HelloWorld/containers/StudentProfile.jsx'
import { Provider } from 'react-redux'
import studentProfile from '../../../reducers/student_profile'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const store = createStore(studentProfile, applyMiddleware(thunk));

export default (props) => (
  <Provider store={store}>
    <StudentProfile
      history={props.history}
      classroomId={props && props.params ? props.params.classroomId : null}
    />
  </Provider>
);
