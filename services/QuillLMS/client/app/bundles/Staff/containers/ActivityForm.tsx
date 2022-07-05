import * as React from 'react'

import Topics from '../components/activityForm/topics'
import RawScore from '../components/activityForm/rawScore'
import ContentPartners from '../components/activityForm/contentPartners'
import { defaultSnackbarTimeout, Snackbar } from '../../Shared/index'
import { requestGet, requestPost, requestPut } from '../../../modules/request/index'

const DEFAULT_MAXIMUM_GRADE_LEVEL = 12

const ActivityForm = ({ activity, activityClassification, contentPartnerOptions, activityCategoryOptions, standardOptions, rawScoreOptions, passedTopicOptions, flagOptions, followUpActivityOptions, gradeBands, readabilityGradeBandToMinimumGradeLevelMap, }) => {
  const [editedActivity, setEditedActivity] = React.useState(activity);
  const [topicOptions, setTopicOptions] = React.useState(passedTopicOptions);
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

  React.useEffect(() => {
    if (editedActivity.raw_score_id && !editedActivity.minimum_grade_level) {
      const selectedRawScoreOption = rawScoreOptions.find(rawScore => rawScore.id === editedActivity.raw_score_id)
      const readabilityGradeBand = gradeBands[selectedRawScoreOption?.name]
      const minimumGradeLevel = readabilityGradeBandToMinimumGradeLevelMap[readabilityGradeBand]
      handleAttributeChange('minimum_grade_level', minimumGradeLevel)
    }
  }, [editedActivity.raw_score_id])

  React.useEffect(() => {
    if (editedActivity.minimum_grade_level && !editedActivity.maximum_grade_level) {
      handleAttributeChange('maximum_grade_level', DEFAULT_MAXIMUM_GRADE_LEVEL)
    }
  }, [editedActivity.minimum_grade_level])

  function submitClassName() {
    let className = "quill-button primary contained large"
    if (!editedActivity.name.length) {
      className+= ' disabled'
    }
    return className
  }

  function handleSubmit(e) {
    e.preventDefault()
    const editedActivityParams = {...editedActivity}
    delete editedActivityParams.id
    if (activity.id) {
      requestPut(`/cms/activity_classifications/${activityClassification.id}/activities/${activity.id}`, { activity: editedActivityParams, },
        (data) => {
          setShowSnackbar(true)
        }
      )
    } else {
      requestPost(`/cms/activity_classifications/${activityClassification.id}/activities/`, { activity: editedActivityParams, },
        (data) => {
          setShowSnackbar(true)
        }
      )
    }
  }

  function getTopics() {
    requestGet('/cms/topics',
      (data) => {
        setTopicOptions(data.topics);
      }
    )
  }

  function createNewTopic(topic) {
    requestPost(`/cms/topics`, { topic, },
      (data) => {
        getTopics()
        setShowSnackbar(true)
        const existingTopicIds = activity.topic_ids
        handleTopicsChange(existingTopicIds.concat(data.topic.id))
      }
    )
  }

  function handleAttributeChange(attribute, value) {
    const newActivity = Object.assign({}, editedActivity, { [attribute]: value })
    setEditedActivity(newActivity)
  }

  function handleNameChange(e) { handleAttributeChange('name', e.target.value) }

  function handleDescriptionChange(e) { handleAttributeChange('description', e.target.value) }

  function handleFlagChange(e) { handleAttributeChange('flags', [e.target.value]) }

  function handleRepeatableChange(e) { handleAttributeChange('repeatable', e.target.checked)}

  function handleSupportingInfoChange(e) { handleAttributeChange('supporting_info', e.target.value)}

  function handleFollowUpActivityChange(e) { handleAttributeChange('follow_up_activity_id', e.target.value)}

  function handleStandardChange(e) { handleAttributeChange('standard_id', e.target.value)}

  function handleMinimumGradeLevelChange(e) { handleAttributeChange('minimum_grade_level', e.target.value && Number(e.target.value))}

  function handleMaximumGradeLevelChange(e) { handleAttributeChange('maximum_grade_level', e.target.value && Number(e.target.value))}

  function handleActivityCategoryChange(e) {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value)
    handleAttributeChange('activity_category_ids', selectedOptions)
  }

  function handleContentPartnerChange(options) {
    handleAttributeChange('content_partner_ids', options)
  }

  function handleRawScoreChange(value) {
    handleAttributeChange('raw_score_id', value && Number(value))
  }

  function handleTopicsChange(options) {
    handleAttributeChange('topic_ids', options)
  }

  const initialFlag = editedActivity.flags[0]
  const flagOptionElements = flagOptions.map(fo => {
    if (fo === initialFlag) {
      return <option key={fo} selected value={fo} >{fo}</option>
    }
    return <option key={fo} value={fo} >{fo}</option>
  })

  const standardOptionElements = standardOptions.map(so => (<option key={so.id} value={so.id}>{so.name}</option>))

  const activityCategoryOptionElements = activityCategoryOptions.map(so => (<option key={so.id} value={so.id}>{so.name}</option>))

  let followUpActivityField

  if (activityClassification.key === 'lessons') {
    const followUpActivityOptionElements = followUpActivityOptions.map(act => (<option key={act.id} value={act.id}>{act.name}</option>))
    followUpActivityField = (<section>
      <label>Followup Activity</label>
      <select onChange={handleFollowUpActivityChange} value={editedActivity.follow_up_activity_id}>{followUpActivityOptionElements}</select>
    </section>)
  }

  return (
    <section className="cms-form">
      <Snackbar text="Changes saved" visible={showSnackbar} />
      <form className="box-full-form form-vertical" onSubmit={handleSubmit}>
        <section className="l-section">
          <section>
            <label>Activity name</label>
            <input onChange={handleNameChange} value={editedActivity.name} />
          </section>
          <section className="description-container">
            <label>Description</label>
            <textarea cols={100} onChange={handleDescriptionChange} rows={10} value={editedActivity.description} />
          </section>
          <section>
            <label>Flag</label>
            <select onChange={handleFlagChange} value={editedActivity.flags[0]}>{flagOptionElements}</select>
          </section>
          <section className="repeatable-container checkbox-container">
            <input checked={editedActivity.repeatable} onChange={handleRepeatableChange} type="checkbox" />
            <label>Repeatable</label>
          </section>
        </section>
        <section>
          <label>Supporting info</label>
          <input onChange={handleSupportingInfoChange} value={editedActivity.supporting_info} />
        </section>
        {followUpActivityField}
        <section>
          <label>Standard</label>
          <select onChange={handleStandardChange} value={editedActivity.standard_id}>{standardOptionElements}</select>
        </section>
        <section>
          <label>Activity Category</label>
          <select className="activity-categories" multiple onChange={handleActivityCategoryChange} value={editedActivity.activity_category_ids}>{activityCategoryOptionElements}</select>
        </section>
        <ContentPartners activity={editedActivity} contentPartnerOptions={contentPartnerOptions} handleContentPartnerChange={handleContentPartnerChange} />
        <RawScore activity={editedActivity} gradeBands={gradeBands} handleRawScoreChange={handleRawScoreChange} rawScoreOptions={rawScoreOptions} />
        <section>
          <label>Minimum grade level</label>
          <input onChange={handleMinimumGradeLevelChange} value={editedActivity.minimum_grade_level} />
        </section>
        <section>
          <label>Maximum grade level</label>
          <input onChange={handleMaximumGradeLevelChange} value={editedActivity.maximum_grade_level} />
        </section>
        <Topics activity={editedActivity} createNewTopic={createNewTopic} handleTopicsChange={handleTopicsChange} topicOptions={topicOptions} />
        <input className={submitClassName()} disabled={!editedActivity.name.length} type="submit" value="Save" />
        <p>When you&apos;ve saved the activity, please head over to the <a href='/assign/activity-library'>Activity Library</a> to make sure the activity metadata looks right in production.</p>
      </form>
    </section>
  )

}

export default ActivityForm
