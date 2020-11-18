import * as React from 'react'

import TopicColumn from '../components/activityForm/topicColumn'

import { Snackbar, defaultSnackbarTimeout } from '../../Shared/index'
import { requestGet, requestPut, requestPost, } from '../../../modules/request/index'

const Topics = ({ activity, createNewTopic, topicOptions, handleTopicsChange, }) => {
  const [topicsEnabled, setTopicsEnabled] = React.useState(!!activity.topic_ids.length)

  React.useEffect(() => {
    if (!topicsEnabled) {
      handleTopicsChange([])
    }
  }, [topicsEnabled])

  function getOptionsForLevel(level: number) {
    if (!topicsEnabled) { return [] }
    return topicOptions.filter(to => to.level === level)
  }

  function getFilteredOptionsForLevel(level: number) {
    const allOptions = getOptionsForLevel(level)
    const selectedLevelTwo = getSelectedOptionForLevel(2)
    const selectedLevelThree = getSelectedOptionForLevel(3)

    if (level === 3 && selectedLevelTwo) {
      return allOptions.filter(o => o.id === selectedLevelTwo.parent_id)
    }

    if (level === 2 && selectedLevelThree) {
      return allOptions.filter(o => o.parent_id === selectedLevelThree.id)
    }

    return allOptions
  }

  function getSelectedOptionForLevel(level: number) {
    const levelOptionsForLevel = getOptionsForLevel(level)
    const option = levelOptionsForLevel.find(t => activity.topic_ids.includes(t.id))
    return option
  }

  function onChangeTopics(topicId) {
    let newTopicIds = [...activity.topic_ids, topicId]
    const topic = topicOptions.find(t => t.id === topicId)
    const extantOption = getSelectedOptionForLevel(topic.level)
    if (extantOption) {
      newTopicIds = newTopicIds.filter(id => id !== extantOption.id)
    }
    handleTopicsChange(newTopicIds)
  }

  function toggleTopicsEnabled(e) {
    setTopicsEnabled(!topicsEnabled)
  }

  const sharedTopicColumnProps = {
    getFilteredOptionsForLevel,
    selectTopic: onChangeTopics,
    getSelectedOptionForLevel,
    createNewTopic
  }

  return (<section className="topics-container enabled-attribute-container">
    <section className="enable-topics-container checkbox-container">
      <input checked={topicsEnabled} onChange={toggleTopicsEnabled} type="checkbox" />
      <label>Topics enabled</label>
    </section>
    <TopicColumn {...sharedTopicColumnProps} levelNumber={3} />
    <TopicColumn {...sharedTopicColumnProps} levelNumber={2} />
    <TopicColumn {...sharedTopicColumnProps} levelNumber={1} />
    <TopicColumn {...sharedTopicColumnProps} levelNumber={0} />
  </section>)
}

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

  return (<section className="raw-score-container enabled-attribute-container">
    <section className="enable-raw-score-container checkbox-container">
      <input checked={rawScoreEnabled} onChange={toggleRawScoreEnabled} type="checkbox" />
      <label>Readability enabled</label>
    </section>
    <section>
      <label>Readability</label>
      <select disabled={!rawScoreEnabled} onChange={onChangeRawScore} value={activity.raw_score_id || ''}>{rawScoreOptionElements}</select>
    </section>
  </section>)
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

  return (<section className="content-partner-container enabled-attribute-container">
    <section className="enable-content-partner-container checkbox-container">
      <input checked={contentPartnerEnabled} onChange={toggleContentPartnerEnabled} type="checkbox" />
      <label>Content partner enabled</label>
    </section>
    <section>
      <label>Content Partner</label>
      <select disabled={!contentPartnerEnabled} multiple onChange={onChangeContentPartner} value={activity.content_partner_ids}>{contentPartnerOptionElements}</select>
    </section>
  </section>)
}

const ActivityForm = ({ activity, activityClassification, contentPartnerOptions, activityCategoryOptions, standardOptions, rawScoreOptions, passedTopicOptions, flagOptions, followUpActivityOptions, }) => {
  const [editedActivity, setEditedActivity] = React.useState(activity);
  const [topicOptions, setTopicOptions] = React.useState(passedTopicOptions);
  const [showSnackbar, setShowSnackbar] = React.useState(false)

  React.useEffect(() => {
    if (showSnackbar) {
      setTimeout(() => setShowSnackbar(false), defaultSnackbarTimeout)
    }
  }, [showSnackbar])

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
      }
    )
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

  function handleTopicsChange(options) {
    handleAttributeChange('topic_ids', options)
  }

  const flagOptionElements = flagOptions.map(fo => (<option value={fo}>{fo}</option>))

  const standardOptionElements = standardOptions.map(so => (<option value={so.id}>{so.name}</option>))

  const activityCategoryOptionElements = activityCategoryOptions.map(so => (<option value={so.id}>{so.name}</option>))

  let followUpActivityField

  if (activityClassification.key === 'lessons') {
    const followUpActivityOptionElements = followUpActivityOptions.map(act => (<option value={act.id}>{act.name}</option>))
    followUpActivityField = (<section>
      <label>Followup Activity</label>
      <select onChange={handleFollowUpActivityChange} value={editedActivity.follow_up_activity_id}>{followUpActivityOptionElements}</select>
    </section>)
  }


  return (<section className="cms-form">
    <Snackbar text="Changes saved" visible={showSnackbar} />
    <form className="box-full-form form-vertical" onSubmit={handleSubmit}>
      <section className="l-section">
        <section>
          <label>Name</label>
          <input onChange={handleNameChange} value={editedActivity.name} />
        </section>
        <section className="description-container">
          <label>Description</label>
          <textarea cols={100} onChange={handleDescriptionChange} rows={10} value={editedActivity.description} />
        </section>
        <section>
          <label>Flag</label>
          <select onChange={handleFlagChange} value={editedActivity.flag}>{flagOptionElements}</select>
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
        <select multiple onChange={handleActivityCategoryChange} value={editedActivity.activity_category_ids}>{activityCategoryOptionElements}</select>
      </section>
      <ContentPartner activity={editedActivity} contentPartnerOptions={contentPartnerOptions} handleContentPartnerChange={handleContentPartnerChange} />
      <RawScore activity={editedActivity} rawScoreOptions={rawScoreOptions} handleRawScoreChange={handleRawScoreChange} />
      <Topics activity={editedActivity} createNewTopic={createNewTopic} topicOptions={topicOptions} handleTopicsChange={handleTopicsChange} />
      <input type="submit" value="Save" />
    </form>
  </section>)
}

export default ActivityForm
