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
import SelectSubRole from './select_sub_role';

const App = ({ subjectAreas, subRoles, user, school, isAdmin, }) => {
  return (
    <BrowserRouter>
      <div id='sign-up'>
        <Route component={SelectUserType} exact path="/account/new" />

        <Route component={SignUpTeacher} path="/sign-up/admin" />
        <Route component={SignUpTeacher} path="/sign-up/individual-contributor" />
        <Route component={SignUpTeacher} path="/sign-up/teacher" />
        <Route component={SignUpStudent} path="/sign-up/student" />

        <Route component={routerProps => <SelectSubRole subRoles={subRoles} {...routerProps} />} path="/sign-up/select-sub-role" />

        <Route component={routerProps => <SelectUSK12 isAdmin={isAdmin} {...routerProps} />} path="/sign-up/add-k12" />
        <Route component={routerProps => <SelectNonUSK12 isAdmin={isAdmin} {...routerProps} />} path="/sign-up/add-non-k12" />

        <Route component={routerProps => <AddTeacherInfo subjectAreas={subjectAreas} {...routerProps} />} path="/sign-up/add-teacher-info" />
      </div>
    </BrowserRouter>
  )
};

export default App
