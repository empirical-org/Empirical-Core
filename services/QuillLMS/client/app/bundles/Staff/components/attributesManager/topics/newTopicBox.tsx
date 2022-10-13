import * as React from "react";
import _ from 'lodash'

import { Topic } from './interfaces'
import ChangeLogModal from '../../shared/changeLogModal'
import { Input, DropdownInput, } from '../../../../Shared/index'

interface NewTopicBoxProps {
  levelNumber: number;
  levelThreeTopics: Topic[],
  levelTwoTopics: Topic[],
  createNewTopic(topic: Topic): void,
  closeTopicBoxProps(event): void
}

const NewTopicBox = ({ levelNumber, levelThreeTopics, levelTwoTopics, createNewTopic, closeTopicBox, }) => {
  const [showChangeLogModal, setShowChangeLogModal] = React.useState(false)
  const [topic, setTopic] = React.useState({ level: levelNumber, name: '', visible: true, parent_id: null })
  const [changeLogs, setChangeLogs] = React.useState([])

  React.useEffect(() => {
    if (changeLogs.length) {
      save()
    }
  }, [changeLogs])

  function handleSubmit(e) {
    e.preventDefault()
    setShowChangeLogModal(true)
  }

  function closeChangeLogModal() {
    setShowChangeLogModal(false)
  }

  function save() {
    const { name, visible, parent_id, level, } = topic
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
    createNewTopic({
      name,
      visible,
      parent_id,
      level,
      change_logs_attributes: formattedChangeLogs
    })
    setShowChangeLogModal(false)
  }

  function changeLevel1(level1Topic) {
    const newTopic = Object.assign({}, topic, { parent_id: level1Topic.value })
    setTopic(newTopic)
  }

  function renameTopic(e) {
    const newTopic = Object.assign({}, topic, { name: e.target.value })
    setTopic(newTopic)
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
            handleChange={renameTopic}
            label={`Level ${topic.level}`}
            type='text'
            value={topic.name}
          />
        </div>
      </div>
    )
  }

  function renderSaveButton() {
    const { name, level, parent_id, } = topic
    const hasParentIfLevelTwo = parent_id || level !== 2
    if (name.length && hasParentIfLevelTwo) {
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

    return (
      <ChangeLogModal
        cancel={closeChangeLogModal}
        changedFields={[{ fieldName: 'new' }]}
        levelNumber={topic.level}
        record={topic}
        save={setChangeLogs}
      />
    )
  }

  return (
    <div className="record-box create-record-box">
      {renderChangeLogModal()}
      <span className="close-record-box" onClick={closeTopicBox}><i className="fas fa-times" /></span>
      <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
        <div className="static">
          <p>Create a Level {topic.level}</p>
        </div>
        <div className="fields">
          {renderLevels()}
          {renderSaveButton()}
        </div>
      </form>
    </div>
  )
}


export default NewTopicBox
