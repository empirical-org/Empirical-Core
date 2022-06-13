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
      loading: false
    }
  }

  handleSkipClick = () => {
    const { selectSchool, } = this.props
    selectSchool('not listed')
  }

  search = () => {
    const { search } = this.state

    const wholeSearchIsNumbersRegex = /^\d+$/

    // if they're typing a zip code, don't search until the full zip code is entered
    if (search.match(wholeSearchIsNumbersRegex) && search.length < 5) {
      return null
    }

    this.setState({ loading: true, })

    request({
      url: `${process.env.DEFAULT_URL}/schools`,
      qs: { search },
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
    return (
      <div className="loading">
        <LoadingIndicator />
      </div>
    )
  }

  renderDefault() {
    return (
      <div className="default-school-search">
        <img alt="Map with a magnifying glass over it" src={mapSearchSrc} />
        <p className="message">Search for your school above</p>
      </div>
    )
  }

  renderNoSchoolFound() {
    return (
      <div className="no-school-found">
        <img alt="Map with a magnifying glass over it" src={mapSearchSrc} />
        <p className="message">We couldn&#39;t find your school</p>
        <p className="sub-text">Try another search or click skip for now below.</p>
      </div>
    )
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
      return (
        <SchoolOption
          key={school.id}
          numberOfTeachersText={numberOfTeachersText}
          school={school}
          secondaryText={secondaryText}
          selectSchool={selectSchool}
          text={text}
        />
      )
    })
    return <ul className="list quill-list double-line">{schoolItems}</ul>
  }

  renderSchoolsListSection = () => {
    const { schools, search, loading } = this.state
    let title
    let schoolsListOrEmptyState
    if (loading) {
      schoolsListOrEmptyState = this.renderLoading()
    } else if (search.length < 5) {
      schoolsListOrEmptyState = this.renderDefault()
    } else if (schools && schools.length) {
      schoolsListOrEmptyState = this.renderSchoolsList(schools)
    } else {
      schoolsListOrEmptyState = this.renderNoSchoolFound()
    }
    return (
      <div className="schools-list-section">
        <div className="title">Results</div>
        {schoolsListOrEmptyState}
        <div className="school-not-listed">School not listed? <button className="interactive-wrapper" onClick={this.handleSkipClick} type="button">Skip for now</button></div>
      </div>
    )
  }

  render () {
    const { errors, search, } = this.state
    return (
      <div className="school-search-container">
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
      </div>
    )
  }
}
