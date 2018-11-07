import React from 'react';
import request from 'request'
import getAuthToken from '../../modules/get_auth_token';
import SchoolSelector from '../../shared/school_selector.jsx'

class SelectUSK12 extends React.Component {
  selectSchool(idOrType) {
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
        <a className="non-k12-link" href="/sign-up/add-non-k12">I don't teach at a U.S. K-12 school</a>
      </div>
    )
  }
}

export default SelectUSK12
