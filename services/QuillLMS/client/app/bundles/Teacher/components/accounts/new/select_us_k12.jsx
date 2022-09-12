import React from 'react';
import request from 'request'

import AssignActivityPackBanner from '../assignActivityPackBanner'
import getAuthToken from '../../modules/get_auth_token';
import SchoolSelector from '../../shared/school_selector.jsx'

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
    request({
      url: `${process.env.DEFAULT_URL}/select_school`,
      json: {
        school_id_or_type: idOrType,
        authenticity_token: getAuthToken(),
      },
      method: 'PUT',
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        window.location = '/finish_sign_up'
      } else {
        // to do, use Sentry to capture error
      }
    });
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
