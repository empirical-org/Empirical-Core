import React from 'react';
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 
import getAuthToken from '../../modules/get_auth_token';
import SchoolSelector from '../../shared/school_selector.jsx'

class SelectUSK12 extends React.Component {
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

  render() {
    return (
      <div className="container account-form select-k12">
        <h1>Let's find your school</h1>
        <SchoolSelector selectSchool={this.selectSchool} />
        <a
          className="non-k12-link"
          href="/sign-up/add-non-k12"
          onClick={(e) => SegmentAnalytics.track(Events.CLICK_NON_K12_SCHOOL)}
        >I don't teach at a U.S. K-12 school</a>
      </div>
    )
  }
}

export default SelectUSK12
