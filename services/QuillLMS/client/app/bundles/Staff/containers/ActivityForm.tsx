import * as React from 'react'

import { Snackbar, defaultSnackbarTimeout } from '../../Shared/index'
import { requestGet, requestPut, requestPost, } from '../../../modules/request/index'

const RawScore = ({ activity, rawScoreOptions, handleRawScoreChange, }) => {
  const [rawScoreEnabled, setRawScoreEnabled] = React.useState(!!activity.raw_score_id)
  const rawScoreOptionElements = [<option value={null}></option>].concat(rawScoreOptions.map(cpo => (<option value={cpo.id}>{cpo.name}</option>)))

  React.useEffect(() => {
    if (!rawScoreEnabled) {
      handleRawScoreChange(null)
    }
  }, [rawScoreEnabled])

  function onChangeRawScore(e) {
    handleRawScoreChange(e.target.value)
  }

  function toggleRawScoreEnabled(e) {
    setRawScoreEnabled(!rawScoreEnabled)
  }

  return (<div className="raw-score-container enabled-attribute-container">
    <div className="enable-raw-score-container checkbox-container">
      <input checked={rawScoreEnabled} onChange={toggleRawScoreEnabled} type="checkbox" />
      <label>Readability enabled</label>
    </div>
    <div>
      <label>Readability</label>
      <select disabled={!rawScoreEnabled} onChange={onChangeRawScore} value={activity.raw_score_id || ''}>{rawScoreOptionElements}</select>
    </div>
  </div>)
}

const ContentPartner = ({ activity, contentPartnerOptions, handleContentPartnerChange, }) => {
  const [contentPartnerEnabled, setContentPartnerEnabled] = React.useState(!!activity.content_partner_ids.length)
  const contentPartnerOptionElements = contentPartnerOptions.map(cpo => (<option value={cpo.id}>{cpo.name}</option>))

  React.useEffect(() => {
    if (!contentPartnerEnabled) {
      handleContentPartnerChange([])
    }
  }, [contentPartnerEnabled])

  function onChangeContentPartner(e) {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    handleContentPartnerChange(selectedOptions)
  }

  function toggleContentPartnerEnabled(e) {
    setContentPartnerEnabled(!contentPartnerEnabled)
  }

  return (<div className="content-partner-container enabled-attribute-container">
    <div className="enable-content-partner-container checkbox-container">
      <input checked={contentPartnerEnabled} onChange={toggleContentPartnerEnabled} type="checkbox" />
      <label>Content partner enabled</label>
    </div>
    <div>
      <label>Content Partner</label>
      <select disabled={!contentPartnerEnabled} multiple onChange={onChangeContentPartner} value={activity.content_partner_ids}>{contentPartnerOptionElements}</select>
    </div>
  </div>)
}

const ActivityForm = ({ activity, activityClassification, contentPartnerOptions, activityCategoryOptions, standardOptions, rawScoreOptions, topicOptions, flagOptions, followUpActivityOptions, }) => {
  const [editedActivity, setEditedActivity] = React.useState(activity);

  function handleSubmit() {
    if (activity.id) {
      requestPut(`/cms/activities/${activity.id}`, { activity: editedActivity, },
        (data) => {
          debugger;
        }
      )
    } else {
      requestPost(`/cms/activities/`, { activity: editedActivity, },
        (data) => {
          debugger;
        }
      )
    }

  }

  function handleAttributeChange(attribute, value) {
    const newActivity = Object.assign({}, editedActivity, { [attribute]: value })
    setEditedActivity(newActivity)
  }

  function handleNameChange(e) { handleAttributeChange('name', e.target.value) }

  function handleDescriptionChange(e) { handleAttributeChange('description', e.target.value) }

  function handleFlagChange(e) { handleAttributeChange('flag', e.target.value) }

  function handleRepeatableChange(e) { handleAttributeChange('repeatable', e.target.checked)}

  function handleSupportingInfoChange(e) { handleAttributeChange('supporting_info', e.target.value)}

  function handleFollowUpActivityChange(e) { handleAttributeChange('follow_up_activity_id', e.target.value)}

  function handleStandardChange(e) { handleAttributeChange('standard_id', e.target.value)}

  function handleActivityCategoryChange(e) {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    handleAttributeChange('activity_category_ids', selectedOptions)
  }

  function handleContentPartnerChange(options) {
    handleAttributeChange('content_partner_ids', options)
  }

  function handleRawScoreChange(value) {
    handleAttributeChange('raw_score_id', value)
  }

  const flagOptionElements = flagOptions.map(fo => (<option value={fo}>{fo}</option>))

  const standardOptionElements = standardOptions.map(so => (<option value={so.id}>{so.name}</option>))

  const activityCategoryOptionElements = activityCategoryOptions.map(so => (<option value={so.id}>{so.name}</option>))

  let followUpActivityField

  if (activityClassification.key === 'lessons') {
    const followUpActivityOptionElements = followUpActivityOptions.map(act => (<option value={act.id}>{act.name}</option>))
    followUpActivityField = (<div>
      <label>Followup Activity</label>
      <select onChange={handleFollowUpActivityChange} value={editedActivity.follow_up_activity_id}>{followUpActivityOptionElements}</select>
    </div>)
  }


  return (<div className="cms-form">
    <form className="box-full-form form-vertical" onSubmit={handleSubmit}>
      <div className="l-section">
        <div>
          <label>Name</label>
          <input onChange={handleNameChange} value={editedActivity.name} />
        </div>
        <div className="description-container">
          <label>Description</label>
          <textarea cols={100} onChange={handleDescriptionChange} rows={10} value={editedActivity.description} />
        </div>
        <div>
          <label>Flag</label>
          <select onChange={handleFlagChange} value={editedActivity.flag}>{flagOptionElements}</select>
        </div>
        <div className="repeatable-container checkbox-container">
          <input checked={activity.repeatable} onChange={handleRepeatableChange} type="checkbox" />
          <label>Repeatable</label>
        </div>
      </div>
      <div>
        <label>Supporting info</label>
        <input onChange={handleSupportingInfoChange} value={editedActivity.supporting_info} />
      </div>
      {followUpActivityField}
      <div>
        <label>Standard</label>
        <select onChange={handleStandardChange} value={editedActivity.standard_id}>{standardOptionElements}</select>
      </div>
      <div>
        <label>Activity Category</label>
        <select multiple onChange={handleActivityCategoryChange} value={editedActivity.activity_category_ids}>{activityCategoryOptionElements}</select>
      </div>
      <ContentPartner activity={editedActivity} contentPartnerOptions={contentPartnerOptions} handleContentPartnerChange={handleContentPartnerChange} />
      <RawScore activity={editedActivity} rawScoreOptions={rawScoreOptions} handleRawScoreChange={handleRawScoreChange} />
      <input type="submit" value="Save" />
    </form>
  </div>)
}

export default ActivityForm
