import React from 'react';
import {
    BrowserRouter,
    Route,
} from 'react-router-dom';
import AddTeacherInfo from './add_teacher_info';
import SelectNonUSK12 from './select_non_us_k12';
import SelectSubRole from './select_sub_role';
import SelectUSK12 from './select_us_k12';
import SelectUserType from './select_user_type';
import SignUpStudent from './sign_up_student';
import SignUpTeacher from './sign_up_teacher';
import VerifyEmail from './verify_email';
import VerifySchool from './verify_school';

const App = ({ subjectAreas, subRoles, user, isAdmin, }) => {
  return (
    <BrowserRouter>
      <div id='sign-up'>
        <Route component={SelectUserType} exact path="/account/new" />

        <Route component={SignUpTeacher} path="/sign-up/admin" />
        <Route component={SignUpTeacher} path="/sign-up/individual-contributor" />
        <Route component={SignUpTeacher} path="/sign-up/teacher" />
        <Route component={SignUpStudent} path="/sign-up/student" />

        <Route component={VerifySchool} path="/sign-up/verify-school" />

        <Route component={routerProps => <VerifyEmail user={user} {...routerProps} />} path="/sign-up/verify-email" />

        <Route component={routerProps => <SelectSubRole subRoles={subRoles} {...routerProps} />} path="/sign-up/select-sub-role" />

        <Route component={routerProps => <SelectUSK12 isAdmin={isAdmin} {...routerProps} />} path="/sign-up/add-k12" />
        <Route component={routerProps => <SelectNonUSK12 isAdmin={isAdmin} {...routerProps} />} path="/sign-up/add-non-k12" />

        <Route component={routerProps => <AddTeacherInfo subjectAreas={subjectAreas} {...routerProps} />} path="/sign-up/add-teacher-info" />
      </div>
    </BrowserRouter>
  )
};

export default App
