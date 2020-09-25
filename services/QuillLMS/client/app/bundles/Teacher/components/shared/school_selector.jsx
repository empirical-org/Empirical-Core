import React from 'react';
import request from 'request'

import LoadingIndicator from './loading_indicator.jsx';
import SchoolOption from './school_option'

import { Input, } from '../../../Shared/index'

const mapSearchSrc = `${process.env.CDN_URL}/images/onboarding/map-search.svg`

export default class SchoolSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      schools: [],
      errors: {},
      loading: true
    }
  }

  componentDidMount() {
    this.enableLocationAccess()
  }

  getLocation = (position) => {
    const { latitude, longitude, } = position.coords
    this.setState({ latitude, longitude, loading: true, }, this.search)
  }

  enableLocationAccess = () => {
    navigator.geolocation.getCurrentPosition(this.getLocation, this.noLocation);
  }

  handleSkipClick = () => {
    const { selectSchool, } = this.props
    selectSchool('not listed')
  }

  locationServicesLink() {
    const { userAgent, } = navigator
    if (userAgent.indexOf('OPR') !== -1) {
      return 'https://help.opera.com/en/geolocation/'
    } else if (userAgent.indexOf('Chrom') !== -1) {
      return 'https://support.google.com/chrome/answer/114662?visit_id=636771351335585730-3894756667&rd=1'
    } else if (userAgent.indexOf('Firefox') !== -1) {
      return 'https://yandex.com/support/common/browsers-settings/geo-firefox.html'
    } else if (userAgent.indexOf('Seamonkey') !== -1) {
      return 'https://www.seamonkey-project.org/doc/2.0/geolocation'
    } else if (userAgent.indexOf('Safari') !== -1) {
      return 'https://support.apple.com/en-us/HT204690'
      // internet explorer
    } else if (userAgent.indexOf('MSIE') !== -1) {
      return 'https://support.microsoft.com/en-us/help/17479/windows-internet-explorer-11-change-security-privacy-settings'
    }
  }

  noLocation = () => {
    this.setState({ loading: false, })
  }

  search = () => {
    const { search, latitude, longitude } = this.state

    const wholeSearchIsNumbersRegex = /^\d+$/

    // if they're typing a zip code, don't search until the full zip code is entered
    if (search.match(wholeSearchIsNumbersRegex) && search.length < 5) {
      return null
    }

    request({
      url: `${process.env.DEFAULT_URL}/schools`,
      qs: { search, lat: latitude, lng: longitude, },
      method: 'GET',
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        const schools = JSON.parse(body).data
        this.setState({ schools, loading: false})
      } else {
        // to do, use Sentry to capture error
      }
    });
  }

  update = (e) => {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  updateKeyValue = (key, value) => {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState, this.search);
  }

  renderLoading() {
    return (<div className="loading">
      <LoadingIndicator />
    </div>)
  }

  renderNoLocationFound() {
    return (<div className="no-location-found">
      <img alt="map search image" src={mapSearchSrc} />
      <p className="message">We couldn&#39;t find your location</p>
      <p className="sub-text"><a href={this.locationServicesLink()} rel="noopener noreferrer" target="_blank">Enable location access</a> or search for your school above.</p>
    </div>)
  }

  renderNoSchoolFound() {
    return (<div className="no-school-found">
      <img alt="map search image" src={mapSearchSrc} />
      <p className="message">We couldn&#39;t find your school</p>
      <p className="sub-text">Try another search or click skip for now below.</p>
    </div>)
  }

  renderSchoolsList = (schools) => {
    const { selectSchool, } = this.props
    const schoolItems = schools.map(school => {
      const { city, number_of_teachers, state, street, text, zipcode } = school.attributes
      const numberOfTeachers = number_of_teachers
      let secondaryText = ''
      let numberOfTeachersText = ''
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
      if (numberOfTeachers) {
        numberOfTeachersText = `${numberOfTeachers} Quill Teacher${numberOfTeachers === 1 ? '' : 's'}`
      }
      return (<SchoolOption
        key={school.id}
        numberOfTeachersText={numberOfTeachersText}
        school={school}
        secondaryText={secondaryText}
        selectSchool={selectSchool}
        text={text}
      />)
    })
    return <ul className="list quill-list double-line">{schoolItems}</ul>
  }

  renderSchoolsListSection = () => {
    const { schools, search, latitude, longitude, loading } = this.state
    let title
    let schoolsListOrEmptyState
    if (loading) {
      schoolsListOrEmptyState = this.renderLoading()
    } else if (search.length < 4 && !latitude && !longitude) {
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
    return (<div className="schools-list-section">
      <div className="title">{title}</div>
      {schoolsListOrEmptyState}
      <div className="school-not-listed">School not listed? <span onClick={this.handleSkipClick}>Skip for now</span></div>
    </div>)
  }

  render () {
    const { errors, search, } = this.state
    return (<div className="school-search-container">
      <Input
        className="search"
        error={errors.search}
        handleChange={this.update}
        id="search"
        label="Search by school name or zip code"
        type="text"
        value={search}
      />
      {this.renderSchoolsListSection()}
    </div>)
  }
}
