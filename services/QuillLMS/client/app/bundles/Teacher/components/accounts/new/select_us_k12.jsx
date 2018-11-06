import React from 'react';
import request from 'request'
import Input from '../../shared/input'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import getAuthToken from '../../modules/get_auth_token';

const mapSearchSrc = `${process.env.CDN_URL}/images/onboarding/map-search.svg`

class SignUpTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      schools: [],
      errors: {}
    }

    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.search = this.search.bind(this)
    this.enableLocationAccess = this.enableLocationAccess.bind(this)
    this.getLocation = this.getLocation.bind(this)
    this.renderSchoolsList = this.renderSchoolsList.bind(this)
    this.renderSchoolsListSection = this.renderSchoolsListSection.bind(this)
    this.selectSchool = this.selectSchool.bind(this)
  }

  componentDidMount() {
    this.enableLocationAccess()
  }

  getLocation(position) {
    console.log('hi')
    const { latitude, longitude, } = position.coords
    this.setState({ latitude, longitude, }, this.search)
  }

  enableLocationAccess() {
    console.log('yo')
    navigator.geolocation.getCurrentPosition(this.getLocation);
  }

  updateKeyValue(key, value) {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState, this.search);
  }

  update(e) {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  search() {
    const { search, latitude, longitude } = this.state
    request({
      url: `${process.env.DEFAULT_URL}/schools`,
      qs: { prefix: search, lat: latitude, lng: longitude, },
      method: 'GET',
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        const schools = JSON.parse(body).data
        this.setState({ schools, })
        console.log('body', body)
        // console.log(body);
      //   window.location = '/sign-up/add-k12'
      // } else {
      //   let state
      //   if (body.errors) {
      //     state = { lastUpdate: new Date(), errors: body.errors, }
      //   } else {
      //     let message = 'You have entered an incorrect email or password.';
      //     if (httpResponse.statusCode === 429) {
      //       message = 'Too many failed attempts. Please wait one minute and try again.';
      //     }
      //     state = { lastUpdate: new Date(), message: (body.message || message), }
      //   }
      //   this.setState(state)
      }
    });
  }

  selectSchool(idOrType) {
    request({
      url: `${process.env.DEFAULT_URL}/select_school`,
      json: {
        school_id_or_type: idOrType,
        authenticity_token: getAuthToken(),
      },
      method: 'POST',
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        window.location = '/profile'
      }
    });
  }

  renderSchoolsList(schools) {
    const schoolItems = schools.map(school => {
      const { city, number_of_teachers, state, street, text, zipcode } = school.attributes
      let secondaryText = ''
      if (street) {
        secondaryText = `${street}, `
      }
      if (city) {
        secondaryText += `${city}, `
      }
      if (state) {
        secondaryText += `${state} `
      }
      if (zipcode) {
        secondaryText += zipcode
      }
      return (<li onClick={() => this.selectSchool(school.id)}>
        <span className="text">
          <span className="primary-text">{text}</span>
          <span className="secondary-text">{secondaryText}</span>
        </span>
        <span className="metadata">{number_of_teachers} Quill Teacher{number_of_teachers === 1 ? '' : 's'}</span>
      </li>)
    })
    return <ul className="list double-line">{schoolItems}</ul>
  }

  renderNoSchoolFound() {
    return <div className="no-school-found">
      <img src={mapSearchSrc} alt="map search image"/>
      <p className="message">We couldn't find your school</p>
      <p className="sub-text">Try another search, or click skip for now below.</p>
    </div>
  }

  locationServicesLink() {
    const { userAgent } = navigator
    if (navigator.userAgent.indexOf("OPR") !== -1){
      return 'https://help.opera.com/en/geolocation/'
    } else if (navigator.userAgent.indexOf("Chrom") !== -1){
      return 'https://support.google.com/chrome/answer/114662?visit_id=636771351335585730-3894756667&rd=1'
    } else if (navigator.userAgent.indexOf("Firefox") !== -1){
      return 'https://yandex.com/support/common/browsers-settings/geo-firefox.html'
    } else if (navigator.userAgent.indexOf("Seamonkey") !== -1){
      return 'https://www.seamonkey-project.org/doc/2.0/geolocation'
    } else if (navigator.userAgent.indexOf("Safari") !== -1){
      return 'https://support.apple.com/en-us/HT204690'
      // internet explorer
    } else if (navigator.userAgent.indexOf("MSIE") !== -1){
      return 'https://support.microsoft.com/en-us/help/17479/windows-internet-explorer-11-change-security-privacy-settings'
    }
  }

  renderNoLocationFound() {
    return <div className="no-location-found">
      <img src={mapSearchSrc} alt="map search image"/>
      <p className="message">We couldn't find your location</p>
      <p className="sub-text"><a target="_blank" href={this.locationServicesLink()}>Enable location</a> access or search for your school above.</p>
    </div>
  }

  renderSchoolsListSection() {
    const { schools, search, latitude, longitude } = this.state
    let title
    let schoolsListOrEmptyState
    if (search.length < 4 && !latitude && !longitude) {
      schoolsListOrEmptyState = this.renderNoLocationFound()
    } else if (schools && schools.length) {
      schoolsListOrEmptyState = this.renderSchoolsList(schools)
    } else {
      schoolsListOrEmptyState = this.renderNoSchoolFound()
    }
    if (search.length < 4) {
      title = 'Schools near you'
    } else {
      title = 'Results'
    }
    return <div className="schools-list-section">
      <div className="title">{title}</div>
      {schoolsListOrEmptyState}
      <div className="school-not-listed">School not listed? <span onClick={() => this.selectSchool('not listed')}>Skip for now</span></div>
    </div>
  }

  render () {
    return (
      <div className="container account-form select-k12">
        <h1>Let's find your school</h1>
        <div className="school-search-container">
          <Input
            label="Search by school name or zip code"
            value={this.state.search}
            handleChange={this.update}
            type="text"
            className="search"
            error={this.state.errors.search}
            id="search"
          />
          {this.renderSchoolsListSection()}
        </div>
        <a className="non-k12-link" href="/sign-up/add-non-k12">I don't teach at a U.S. K-12 school</a>
      </div>
    )
  }
}

export default SignUpTeacher
