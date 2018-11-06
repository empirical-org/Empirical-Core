import React from 'react';
import request from 'request'
import Input from '../../shared/input'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import getAuthToken from '../../modules/get_auth_token';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

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
    this.getLocation = this.getLocation.bind(this)
    this.renderSchoolsList = this.renderSchoolsList.bind(this)
    this.renderSchoolsListSection = this.renderSchoolsListSection.bind(this)
    this.selectSchool = this.selectSchool.bind(this)
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.getLocation);
  }

  getLocation(position) {
    const { latitude, longitude, } = position.coords
    this.setState({ latitude, longitude, }, this.search)
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

  renderSchoolsListSection() {
    const { schools, search, latitude, longitude } = this.state
    let title, schoolsList
    if (schools) {
      schoolsList = this.renderSchoolsList(schools)
    }
    if (!search && latitude && longitude) {
      title = 'Schools near you'
    } else if (search) {
      title = 'Results'
    }
    return <div className="schools-list-section">
      <div className="title">{title}</div>
      {schoolsList}
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
