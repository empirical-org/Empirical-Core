import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import SelectUserType from './select_user_type';
import SignUpTeacher from './sign_up_teacher';
import SignUpStudent from './sign_up_student';
import SelectUSK12 from './select_us_k12';
import SelectNonUSK12 from './select_non_us_k12';


class App extends Component {
  render() {
    return (
      <Router>
        <div id='sign-up'>
          <Route exact path="/account/new" component={SelectUserType}/>

          <Route path="/sign-up/teacher" component={SignUpTeacher}/>
          <Route path="/sign-up/student" component={SignUpStudent}/>

          <Route path="/sign-up/add-k12" component={SelectUSK12}/>
          <Route path="/sign-up/add-non-k12" component={SelectNonUSK12}/>
        </div>
      </Router>
    )
  }
}

export default App
