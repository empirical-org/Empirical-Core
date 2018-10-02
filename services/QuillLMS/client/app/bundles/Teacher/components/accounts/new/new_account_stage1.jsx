import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import SelectUserType from './select_user_type';
import SignUpTeacher from './sign_up_teacher';
import SelectSchoolType from './select_school_type';
import SelectUSK12 from './select_us_k12'


class App extends Component {
  render() {
    /*
    <Route path="/sign-up/student" component={StudentSignup}/>
    */
    return (
      <Router>
        <div>
          <Route exact path="/account/new" component={SelectUserType}/>
          <Route path="/sign-up/teacher" component={SignUpTeacher}/>
          <Route path="/sign-up/pick-school-type" component={SelectSchoolType}/>
          <Route path="/sign-up/add-k12" component={SelectUSK12}/>
        </div>
      </Router>
    )
  }
}

export default App
