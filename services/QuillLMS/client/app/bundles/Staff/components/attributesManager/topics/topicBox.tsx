import _ from 'lodash';
import moment from 'moment';
import * as React from "react";

import { DropdownInput, Input } from '../../../../Shared/index';
import ChangeLogModal from '../../shared/changeLogModal';
import IndividualRecordChangeLogs from '../../shared/individualRecordChangeLogs';
import { Topic } from './interfaces';

interface TopicBoxProps {
  originalTopic: Topic;
  levelThreeTopics: Topic[],
  levelTwoTopics: Topic[],
  saveTopicChanges(topic: Topic): void,
  closeTopicBox(event): void
}

const formatDateTime = (cl) => moment(cl.created_at).format('MMMM D, YYYY [at] LT')

const TopicBox = ({ originalTopic, levelThreeTopics, levelTwoTopics, saveTopicChanges, closeTopicBox, }) => {
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

  function toggleVisibility() {
    const newTopic = Object.assign({}, topic, { visible: !topic.visible })
    setTopic(newTopic)
  }

  function renameTopic(e) {
    const newTopic = Object.assign({}, topic, { name: e.target.value })
    setTopic(newTopic)
  }

  function cancelRename(e) {
    const newTopic = Object.assign({}, topic, { name: originalTopic.name })
    setTopic(newTopic)
  }

  function activateTopicInput() {
    document.getElementById('record-name').focus()
  }

  function renderDropdownInput(topics, level) {
    const options = topics.map(t => ({ value: t.id, label: t.name })).sort((a, b) => a.label.localeCompare(b.label))
    const value = options.find(opt => opt.value === topic.parent_id)
    return (
      <DropdownInput
        handleChange={changeLevel1}
        isSearchable={true}
        label={"Level " + level}
        options={options}
        value={value}
      />
    )
  }

  function renderRenameAndArchiveSection() {
    return (
      <div className="rename-and-archive">
        <span className="rename" onClick={activateTopicInput}>
          <i className="fas fa-edit" />
          <span>Rename</span>
        </span>
        <span className="archive" onClick={toggleVisibility}>
          <i className="fas fa-archive" />
          <span>{ topic.visible ? 'Archive' : 'Unarchive' }</span>
        </span>
      </div>
    )
  }

  function renderLevels() {
    let dropdown
    if (topic.level === 2) {
      dropdown = renderDropdownInput(levelThreeTopics, 3)
    } else if (topic.level === 1) {
      dropdown = renderDropdownInput(levelTwoTopics, 2)
    }

    return (
      <div>
        {dropdown}
        <div className="record-input-container">
          <Input
            handleCancel={cancelRename}
            handleChange={renameTopic}
            id='record-name'
            label={`Level ${topic.level}`}
            type='text'
            value={topic.name}
          />
          {renderRenameAndArchiveSection()}
        </div>
        <IndividualRecordChangeLogs changeLogs={topic.change_logs} formatDateTime={formatDateTime} />
      </div>
    )
  }

  function renderSaveButton() {
    if (!_.isEqual(topic, originalTopic)) {
      return (
        <input
          className="quill-button contained primary medium"
          type="submit"
          value="Save"
        />
      )
    }
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
