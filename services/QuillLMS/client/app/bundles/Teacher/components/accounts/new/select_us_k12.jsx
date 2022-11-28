import React from 'react';

import AssignActivityPackBanner from '../assignActivityPackBanner'
import SchoolSelector from '../../shared/school_selector.jsx'
import { requestPut, } from '../../../../../modules/request/index'

class SelectUSK12 extends React.Component {
  componentDidMount() {
    document.title = 'Quill.org | Teacher Sign Up | Add School'
  }

  handleNonK12LinkClick = (e) => {
    window.location.href = "/sign-up/add-non-k12"
  }

  selectSchool(idOrType) {
    // The "Skip this step" link in the school selection module trigger this function
    // with the argument 'non listed', while actually selecting a school triggers it
    // with a school identifier.
    requestPut(
      `${process.env.DEFAULT_URL}/select_school`,
      { school_id_or_type: idOrType, },
      (body) => {
        window.location = '/sign-up/add-teacher-info'
      }
    )
  }

  render() {
    return (
      <div>
        <AssignActivityPackBanner />
        <div className="container account-form select-k12">
          <h1>Let&#39;s find your school</h1>
          <p className="subheader">Select a school so that if your school has Quill Premium, your account will have access to it.</p>
          <SchoolSelector selectSchool={this.selectSchool} />
          <button
            className="non-k12-link focus-on-light"
            onClick={this.handleNonK12LinkClick}
            type="button"
          >I don&#39;t teach at a U.S. K-12 school</button>
        </div>
      </div>
    )
  }
}

export default SelectUSK12
