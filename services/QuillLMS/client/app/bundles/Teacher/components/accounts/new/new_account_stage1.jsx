import React from 'react';
import {
  BrowserRouter,
  Route,
} from 'react-router-dom'
import SelectUserType from './select_user_type';
import SignUpTeacher from './sign_up_teacher';
import SignUpStudent from './sign_up_student';
import SelectUSK12 from './select_us_k12';
import SelectNonUSK12 from './select_non_us_k12';
import AddTeacherInfo from './add_teacher_info';

const App = ({ subjectAreas, }) => {
  return (
    <BrowserRouter>
      <div id='sign-up'>
        <Route component={SelectUserType} exact path="/account/new" />

        <Route component={SignUpTeacher} path="/sign-up/individual-contributor" />
        <Route component={SignUpTeacher} path="/sign-up/teacher" />
        <Route component={SignUpStudent} path="/sign-up/student" />

        <Route component={SelectUSK12} path="/sign-up/add-k12" />
        <Route component={SelectNonUSK12} path="/sign-up/add-non-k12" />

        <Route component={routerProps => <AddTeacherInfo subjectAreas={subjectAreas} {...routerProps} />} path="/sign-up/add-teacher-info" />
      </div>
    </BrowserRouter>
  )
};

export default App
