import React from 'react';

import LoadingIndicator from './loading_indicator.jsx';
import SchoolOption from './school_option';

import { requestGet, requestPost } from '../../../../modules/request';
import { Input, NOT_LISTED, NO_SCHOOL_SELECTED, smallWhiteCheckIcon } from '../../../Shared/index';
import useDebounce from '../../hooks/useDebounce';

const mapSearchSrc = `${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/onboarding/map-search.svg`

const DEBOUNCE_LENGTH = 500
const MINIMUM_SEARCH_LENGTH = 2
const WHOLE_SEARCH_IS_NUMBERS_REGEX = /^\d+$/

const SchoolSelector = ({ selectSchool, showDismissSchoolSelectionReminderCheckbox, handleDismissSchoolSelectionReminder, disableSkipForNow}) => {
  const [search, setSearch] = React.useState('')
  const [schools, setSchools] = React.useState([])
  const [errors, setErrors] = React.useState({})
  const [loading, setLoading] = React.useState(false)
  const [showNotListedModal, setShowNotListedModal] = React.useState(false)
  const [unlistedSchoolName, setUnlistedSchoolName] = React.useState('')
  const [unlistedSchoolZipcode, setUnlistedSchoolZipcode] = React.useState('')
  const [dismissSchoolSelectionReminder, setDismissSchoolSelectionReminder] = React.useState(false)

  const debouncedSearch = useDebounce(search, DEBOUNCE_LENGTH);

  React.useEffect(() => {
    if (search.length >= MINIMUM_SEARCH_LENGTH) {
      setLoading(true)
    }
  }, [search])

  React.useEffect(() => {
    if (search.length < MINIMUM_SEARCH_LENGTH) { return }
    // if they're typing a zip code, don't search until the full zip code is entered
    if (search.match(WHOLE_SEARCH_IS_NUMBERS_REGEX) && search.length < 5) { return }

    searchForSchool()
  }, [debouncedSearch])

  function toggleDismissReminderCheckbox() { setDismissSchoolSelectionReminder(!dismissSchoolSelectionReminder) }

  function handleSkipClick() {
    if (dismissSchoolSelectionReminder) {
      handleDismissSchoolSelectionReminder()
    }
    selectSchool(NO_SCHOOL_SELECTED)
  }

  function handleNotListedClick() {
    setShowNotListedModal(true)
  }

  function onChangeUnlistedSchoolName(e) { setUnlistedSchoolName(e.target.value) }
  function onChangeUnlistedSchoolZipcode(e) { setUnlistedSchoolZipcode(e.target.value) }

  function submitSchoolNotListedInformation() {
    requestPost('/submit_unlisted_school_information', { school_name: unlistedSchoolName, school_zipcode: unlistedSchoolZipcode }, () => {
      selectSchool(NOT_LISTED)
    })
  }

  function searchForSchool() {
    requestGet(
      `${import.meta.env.VITE_DEFAULT_URL}/schools?search=${search}`,
      (body) => {
        setSchools(body.data)
        setLoading(false)
      }
    )
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

  const renderSchoolNotListedModal = () => {
    if (!showNotListedModal) { return <span /> }
    return (
      <div className="modal-container school-not-listed-modal-container">
        <div className="modal-background" />
        <div className="school-not-listed-modal quill-modal modal-body">
          <div>
            <h3 className="title">School not listed?</h3>
          </div>
          <p>Please share your school name and ZIP code below. Quill will review and update our database.</p>
          <Input
            handleChange={onChangeUnlistedSchoolName}
            label="School name"
            type="text"
            value={unlistedSchoolName}
          />
          <Input
            handleChange={onChangeUnlistedSchoolZipcode}
            label="ZIP code"
            type="text"
            value={unlistedSchoolZipcode}
          />
          <div className="form-buttons">
            <button className="quill-button primary contained medium focus-on-light" onClick={submitSchoolNotListedInformation} type="button">Done</button>
          </div>
        </div>
      </div>
    )
  }

  const noSchoolSelectedSchoolOption = (
    <SchoolOption
      key={NOT_LISTED}
      numberOfTeachersText=''
      school={{id: NOT_LISTED}}
      secondaryText="Please select this if you can't find your school"
      selectSchool={handleNotListedClick}
      text="Not listed"
    />
  )

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
    return <ul className="list quill-list double-line">{schoolItems}{noSchoolSelectedSchoolOption}</ul>
  }

  const skipForNowCheckbox = () => {
    if (disableSkipForNow) { return }

    let checkbox = (
      <button
        aria-checked={false}
        aria-label="Unchecked"
        className="quill-checkbox unselected focus-on-light"
        onClick={toggleDismissReminderCheckbox}
        role="checkbox"
        type="button"
      />
    )

    const checkboxWrapper = showDismissSchoolSelectionReminderCheckbox
      ? <div className="checkbox-wrapper">{checkbox} <span>Don&#39;t remind me again to select a school</span></div>
      : <span />

    if (dismissSchoolSelectionReminder) {
      checkbox = (
        <button
          aria-checked={true}
          className="quill-checkbox selected focus-on-light"
          onClick={toggleDismissReminderCheckbox}
          role="checkbox"
          type="button"
        >
          <img alt={smallWhiteCheckIcon.alt} src={smallWhiteCheckIcon.src} />
        </button>
      )
    }

    return (
      <div className="school-not-listed">
        <button className="interactive-wrapper" onClick={handleSkipClick} type="button">Skip for now</button>
        {checkboxWrapper}
      </div>
    )
  }

  const renderSchoolsListSection = () => {
    let title
    let schoolsListOrEmptyState

    if (loading) {
      schoolsListOrEmptyState = renderLoading()
    } else if (search.length >= MINIMUM_SEARCH_LENGTH) {
      schoolsListOrEmptyState = renderSchoolsList(schools)
    } else {
      schoolsListOrEmptyState = renderDefault()
    }

    return (
      <div className="schools-list-section">
        <div className="title">Results</div>
        {schoolsListOrEmptyState}
        {skipForNowCheckbox()}
      </div>
    )
  }

  return (
    <div className="school-search-container">
      {renderSchoolNotListedModal()}
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
