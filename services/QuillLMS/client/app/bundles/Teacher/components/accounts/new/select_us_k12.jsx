import React from 'react';
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics';
import getAuthToken from '../../modules/get_auth_token';
import SchoolSelector from '../../shared/school_selector.jsx'

class SelectUSK12 extends React.Component {
  componentDidMount() {
    document.title = 'Quill.org | Teacher Sign Up | Add School'
  }

  selectSchool(idOrType) {
    // The "Skip this step" link in the school selection module trigger this function
    // with the argument 'non listed', while actually selecting a school triggers it
    // with a school identifier.
    if (idOrType == 'not listed') {
      SegmentAnalytics.track(Events.CLICK_SKIP_SELECT_SCHOOL);
    } else {
      SegmentAnalytics.track(Events.CLICK_SELECT_SCHOOL, {schoolSelected: idOrType});
    }
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
        window.location = '/profile'
      } else {
        // to do, use Sentry to capture error
      }
    });
  }

  handleNonK12LinkClick = (e) => {
    SegmentAnalytics.track(Events.CLICK_NON_K12_SCHOOL)
    window.location.href = "/sign-up/add-non-k12"
  }

  render() {
    return (
      <div className="container account-form select-k12">
        <h1>Let&#39;s find your school</h1>
        <SchoolSelector selectSchool={this.selectSchool} />
        <button
          className="non-k12-link focus-on-light"
          onClick={this.handleNonK12LinkClick}
          type="button"
        >I don&#39;t teach at a U.S. K-12 school</button>
      </div>
    )
  }
}

export default SelectUSK12
