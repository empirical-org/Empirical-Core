import React from 'react';
import request from 'request'

import LoadingIndicator from './loading_indicator.jsx';
import SchoolOption from './school_option'

import { Input, } from '../../../Shared/index'
import useDebounce from '../../hooks/useDebounce'

const mapSearchSrc = `${process.env.CDN_URL}/images/onboarding/map-search.svg`

export const NOT_LISTED = 'not listed'
const DEBOUNCE_LENGTH = 500
const MINIMUM_SEARCH_LENGTH = 3

const SchoolSelector = ({ selectSchool, }) => {
  const [search, setSearch] = React.useState('')
  const [schools, setSchools] = React.useState([])
  const [errors, setErrors] = React.useState({})
  const [loading, setLoading] = React.useState(false)

  const debouncedSearch = useDebounce(search, DEBOUNCE_LENGTH);

  React.useEffect(() => {
    if (search.length) {
      setLoading(true)
    }
  }, [search])

  React.useEffect(() => {
    searchForSchool()
  }, [debouncedSearch])

  function handleSkipClick() { selectSchool(NOT_LISTED) }

  function searchForSchool() {
    const wholeSearchIsNumbersRegex = /^\d+$/

    // if they're typing a zip code, don't search until the full zip code is entered
    if (search.match(wholeSearchIsNumbersRegex) && search.length < 5) { return }

    request({
      url: `${process.env.DEFAULT_URL}/schools`,
      qs: { search },
      method: 'GET',
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        const schools = JSON.parse(body).data
        setSchools(schools)
        setLoading(false)
      } else {
        // to do, use Sentry to capture error
      }
    });
  }

  function updateSearch(e) {
    setSearch(e.target.value)
  }

  const renderLoading = () => {
    return (
      <div className="loading">
        <LoadingIndicator />
      </div>
    )
  }

  const renderDefault = () => {
    return (
      <div className="default-school-search">
        <img alt="Map with a magnifying glass over it" src={mapSearchSrc} />
        <p className="message">Search for your school above</p>
      </div>
    )
  }

  const renderNoSchoolFound = () => {
    return (
      <div className="no-school-found">
        <img alt="Map with a magnifying glass over it" src={mapSearchSrc} />
        <p className="message">We couldn&#39;t find your school</p>
        <p className="sub-text">Try another search or click skip for now below.</p>
      </div>
    )
  }

  const renderSchoolsList = (schools) => {
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

  const renderSchoolsListSection = () => {
    let title
    let schoolsListOrEmptyState
    if (loading) {
      schoolsListOrEmptyState = renderLoading()
    } else if (search.length && schools.length >= MINIMUM_SEARCH_LENGTH) {
      schoolsListOrEmptyState = renderNoSchoolFound()
    } else if (schools && schools.length) {
      schoolsListOrEmptyState = renderSchoolsList(schools)
    } else {
      schoolsListOrEmptyState = renderDefault()
    }
    return (
      <div className="schools-list-section">
        <div className="title">Results</div>
        {schoolsListOrEmptyState}
        <div className="school-not-listed">School not listed? <button className="interactive-wrapper" onClick={handleSkipClick} type="button">Skip for now</button></div>
      </div>
    )
  }

  return (
    <div className="school-search-container">
      <Input
        className="search"
        error={errors.search}
        handleChange={updateSearch}
        id="search"
        label="Search by school name or zip code"
        type="text"
        value={search}
      />
      {renderSchoolsListSection()}
    </div>
  )
}

export default SchoolSelector
