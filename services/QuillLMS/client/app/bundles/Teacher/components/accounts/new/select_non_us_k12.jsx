import React from 'react';
import request from 'request'
import getAuthToken from '../../modules/get_auth_token';

const homeSchoolSrc = `${process.env.CDN_URL}/images/onboarding/home-building.svg`
const internationalSrc = `${process.env.CDN_URL}/images/onboarding/globe.svg`
const higherEdSrc = `${process.env.CDN_URL}/images/onboarding/school-campus.svg`
const otherSrc = `${process.env.CDN_URL}/images/onboarding/business-building.svg`

class SelectUSNonK12 extends React.Component {
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
      <div className="container account-form select-non-k12">
        <h1>Where do you teach?</h1>
        <div className="quill-cards">
          <div className="quill-card" onClick={() => this.selectSchool('home school')}>
            <img src={homeSchoolSrc} alt="home"/>
            <div className="text">
              <h3>Home school</h3>
              <p>Tip: many home school teachers begin by assigning our Starter&nbsp;Diagnostic.</p>
            </div>
          </div>
          <div className="quill-card" onClick={() => this.selectSchool('international')}>
            <img src={internationalSrc} alt="globe"/>
            <div className="text">
              <h3>International institution</h3>
              <p>Tip: many international teachers begin by assigning our ELL&nbsp;Diagnostic.</p>
            </div>
          </div>
          <div className="quill-card" onClick={() => this.selectSchool('us higher ed')}>
            <img src={higherEdSrc} alt="college campus"/>
            <div className="text">
              <h3>U.S. higher education institution</h3>
              <p>Tip: many of our higher education educators begin by assigning our Quill Connect sentence combining&nbsp;activities.</p>
            </div>
          </div>
          <div className="quill-card" onClick={() => this.selectSchool('other')}>
            <img src={otherSrc} alt="office building"/>
            <div className="text">
              <h3>Other</h3>
              <p>Tip: many of our higher education educators begin by assigning our Quill Connect sentence combining&nbsp;activities.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SelectUSNonK12
