import React from 'react';
import request from 'request'
import { Input } from 'quill-component-library/dist/componentLibrary'
import LoadingIndicator from './loading_indicator.jsx';

const mapSearchSrc = `${process.env.CDN_URL}/images/onboarding/map-search.svg`

class SchoolSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      schools: [],
      errors: {},
      loading: true
    }

    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.search = this.search.bind(this)
    this.enableLocationAccess = this.enableLocationAccess.bind(this)
    this.getLocation = this.getLocation.bind(this)
    this.noLocation = this.noLocation.bind(this)
    this.renderSchoolsList = this.renderSchoolsList.bind(this)
    this.renderSchoolsListSection = this.renderSchoolsListSection.bind(this)
  }

  componentDidMount() {
    this.enableLocationAccess()
  }

  getLocation(position) {
    const { latitude, longitude, } = position.coords
    this.setState({ latitude, longitude, loading: true, }, this.search)
  }

  noLocation() {
    this.setState({ loading: false, })
  }

  enableLocationAccess() {
    navigator.geolocation.getCurrentPosition(this.getLocation, this.noLocation);
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
      qs: { search, lat: latitude, lng: longitude, },
      method: 'GET',
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        const schools = JSON.parse(body).data
        this.setState({ schools, loading: false})
      } else {
        console.log('err', err)
      }
    });
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

  renderSchoolsList(schools) {
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
      return (<li onClick={() => this.props.selectSchool(school.id, school)}>
        <span className="text">
          <span className="primary-text">{text}</span>
          <span className="secondary-text">{secondaryText}</span>
        </span>
        <span className="metadata">{numberOfTeachersText}</span>
      </li>)
    })
    return <ul className="list quill-list double-line">{schoolItems}</ul>
  }

  renderLoading() {
    return <div className="loading">
      <LoadingIndicator/>
    </div>
  }

  renderNoSchoolFound() {
    return <div className="no-school-found">
      <img src={mapSearchSrc} alt="map search image"/>
      <p className="message">We couldn't find your school</p>
      <p className="sub-text">Try another search or click skip for now below.</p>
    </div>
  }

  renderNoLocationFound() {
    return <div className="no-location-found">
      <img src={mapSearchSrc} alt="map search image"/>
      <p className="message">We couldn't find your location</p>
      <p className="sub-text"><a target="_blank" href={this.locationServicesLink()}>Enable location access</a> or search for your school above.</p>
    </div>
  }

  renderSchoolsListSection() {
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
    return <div className="schools-list-section">
      <div className="title">{title}</div>
      {schoolsListOrEmptyState}
      <div className="school-not-listed">School not listed? <span onClick={() => this.props.selectSchool('not listed')}>Skip for now</span></div>
    </div>
  }

  render () {
    return <div className="school-search-container">
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
  }
}

export default SchoolSelector
