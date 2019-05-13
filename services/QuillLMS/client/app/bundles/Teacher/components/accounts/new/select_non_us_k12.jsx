import React from 'react';
import request from 'request'
import { SegmentAnalytics, Events } from '../../../../../modules/analytics'; 
import getAuthToken from '../../modules/get_auth_token';
import { Card } from 'quill-component-library/dist/componentLibrary'

const homeSchoolSrc = `${process.env.CDN_URL}/images/onboarding/home-building.svg`
const internationalSrc = `${process.env.CDN_URL}/images/onboarding/globe.svg`
const higherEdSrc = `${process.env.CDN_URL}/images/onboarding/school-campus.svg`
const otherSrc = `${process.env.CDN_URL}/images/onboarding/business-building.svg`

class SelectUSNonK12 extends React.Component {
  selectSchool(idOrType) {
    SegmentAnalytics.track(Events.CLICK_CHOOSE_SCHOOL_TYPE, {schoolType: idOrType});
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
          <Card
            onClick={() => this.selectSchool('home school')}
            imgSrc={homeSchoolSrc}
            imgAlt="home"
            header="Home school"
            text="Tip: many home school teachers begin by assigning our Starter&nbsp;Diagnostic."
          />
          <Card
            onClick={() => this.selectSchool('international')}
            imgSrc={internationalSrc}
            imgAlt="globe"
            header="International institution"
            text="Tip: many international teachers begin by assigning our ELL&nbsp;Diagnostic."
          />
          <Card
            onClick={() => this.selectSchool('us higher ed')}
            imgSrc={higherEdSrc}
            imgAlt="college campus"
            header="U.S. higher education institution"
            text="Tip: many of our higher education educators begin by assigning our Quill Connect sentence combining&nbsp;activities."
          />
          <Card
            onClick={() => this.selectSchool('other')}
            imgSrc={otherSrc}
            imgAlt="office building"
            header="Other"
            text="Tip: many non-traditional educators and learners begin by assigning our featured activity packs."
          />
        </div>
      </div>
    )
  }
}

export default SelectUSNonK12
