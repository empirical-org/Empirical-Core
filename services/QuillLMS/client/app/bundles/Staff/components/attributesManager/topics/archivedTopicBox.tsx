import moment from 'moment';
import * as React from "react";

import { Topic } from './interfaces';

import { DropdownInput, Input } from '../../../../Shared/index';
import ChangeLogModal from '../../shared/changeLogModal';
import IndividualRecordChangeLogs from '../../shared/individualRecordChangeLogs';

interface ArchivedTopicBoxProps {
  originalTopic: Topic;
  levelThreeTopics: Topic[],
  saveTopicChanges(topic: Topic): void,
  closeTopicBox(event): void
}

const formatDateTime = (cl) => moment(cl.created_at).format('MMMM D, YYYY [at] LT')

const TopicBox = ({ originalTopic, levelThreeTopics, saveTopicChanges, closeTopicBox, }: ArchivedTopicBoxProps) => {
  const [showChangeLogModal, setShowChangeLogModal] = React.useState(false)
  const [topic, setTopic] = React.useState(originalTopic)
  const [changeLogs, setChangeLogs] = React.useState([])

  React.useEffect(() => {
    if (changeLogs.length) {
      save()
    }
  }, [changeLogs])
  React.useEffect(() => { setTopic(originalTopic) }, [originalTopic])

  function handleSubmit(e) {
    e.preventDefault()
    const newTopic = Object.assign({}, topic, { visible: true })
    setTopic(newTopic)
    setShowChangeLogModal(true)
  }

  function closeChangeLogModal() {
    setShowChangeLogModal(false)
  }

  function save() {
    const { id, name, visible, parent_id, } = topic
    const formattedChangeLogs = changeLogs.map(cl => {
      const { action, explanation, changedAttribute, newValue, previousValue, recordID, } = cl
      return {
        action,
        explanation,
        changed_attribute: changedAttribute,
        previous_value: previousValue,
        new_value: newValue,
        changed_record_id: recordID,
        changed_record_type: 'Topic'
      }
    })
    saveTopicChanges({
      id,
      name,
      visible,
      parent_id,
      change_logs_attributes: formattedChangeLogs
    })
    setShowChangeLogModal(false)
  }

  function changeLevel1(level1Topic) {
    const newTopic = Object.assign({}, topic, { parent_id: level1Topic.value })
    setTopic(newTopic)
  }

  function renderDropdownInput() {
    const options = levelThreeTopics.map(t => ({ value: t.id, label: t.name })).sort((a, b) => a.label.localeCompare(b.label))
    const value = options.find(opt => opt.value === topic.parent_id)
    const levelThreeTopic = levelThreeTopics.find(t => t.id === topic.parent_id)
    return (
      <div className="record-input-container">
        <DropdownInput
          handleChange={changeLevel1}
          isSearchable={true}
          label="Level 3"
          options={options}
          value={value}
        />
        {renderArchivedOrLive(levelThreeTopic)}
      </div>
    )
  }

  function renderArchivedOrLive(t) {
    if (t.visible) {
      return (
        <div className="live-or-archived">
          <div>
            <div className="live" />
            Live
          </div>
        </div>
      )
    }

    return (
      <div className="live-or-archived">
        <div>
          <div className="archived" />
          Archived
        </div>
        <div className="date">{moment(t.updated_at).format('M/D/YY')}</div>
      </div>
    )
  }

  function renderLevels() {
    const dropdown = topic.level === 2 ? renderDropdownInput() : null

    return (
      <div>
        {dropdown}
        <div className="record-input-container">
          <Input
            disabled={true}
            label={`Level ${topic.level}`}
            type='text'
            value={topic.name}
          />
          {renderArchivedOrLive(topic)}
        </div>
        <IndividualRecordChangeLogs changeLogs={topic.change_logs} formatDateTime={formatDateTime} />
      </div>
    )
  }

  function renderSaveButton() {
    if (topic.level === 2 && !levelThreeTopics.find(t => t.id === topic.parent_id).visible) {
      return (
        <input
          className="quill-button contained disabled primary medium"
          type="submit"
          value="Unarchive, set live"
        />
      )
    }

    return (
      <input
        className="quill-button contained primary medium"
        type="submit"
        value="Unarchive, set live"
      />
    )
  }

  function renderChangeLogModal() {
    if (!showChangeLogModal) { return }

    const changedFields = []
    Object.keys(topic).forEach(key => {
      if (topic[key] !== originalTopic[key]) {
        let changedField = { fieldName: key, previousValue: originalTopic[key], newValue: topic[key]}
        changedFields.push(changedField)
      }
    })
    return (
      <ChangeLogModal
        cancel={closeChangeLogModal}
        changedFields={changedFields}
        levelNumber={topic.level}
        record={topic}
        save={setChangeLogs}
      />
    )
  }

  return (
    <div className="record-box">
      {renderChangeLogModal()}
      <span className="close-record-box" onClick={closeTopicBox}><i className="fas fa-times" /></span>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="static">
          <p>Level {topic.level}</p>
          <h1>{topic.name}</h1>
        </div>
        <div className="fields">
          {renderLevels()}
          {renderSaveButton()}
        </div>
      </form>
    </div>
  )
}


export default TopicBox
