import React from 'react';
import { PropTypes } from 'react-metrics';
import request from 'request'
import getAuthToken from '../../modules/get_auth_token';
import SchoolSelector from '../../shared/school_selector.jsx'

class SelectUSK12 extends React.Component {
  static contextTypes = {
    metrics: PropTypes.metrics
  }

  constructor(props) {
    super(props);
    this.selectSchool = this.selectSchool.bind(this);
  }

  selectSchool(idOrType) {
    // The "Skip this step" link in the school selection module trigger this function
    // with the argument 'non listed', while actually selecting a school triggers it
    // with a school identifier.
    if (idOrType == 'not listed') {
      this.context.metrics.track('Teacher.SelectSchool.SelectK12.ClickSkipSelection');
    } else {
      this.context.metrics.track('Teacher.SelectSchool.SelectK12.SelectSchool');
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
        console.log('error', err)
      }
    });
  }

  render() {
    return (
      <div className="container account-form select-k12">
        <h1>Let's find your school</h1>
        <SchoolSelector selectSchool={this.selectSchool}/>
        <a className="non-k12-link" href="/sign-up/add-non-k12"
           onClick={(e) => this.context.metrics.track('Teacher.SelectSchool.SelectK12.ClickNonK12')}>
          I don't teach at a U.S. K-12 school
        </a>
      </div>
    )
  }
}

export default SelectUSK12
