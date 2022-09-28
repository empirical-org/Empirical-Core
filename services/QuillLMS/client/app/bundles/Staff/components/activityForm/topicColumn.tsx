import * as React from 'react'

const TopicColumn = ({ createNewTopic, levelNumber, selectTopic, getFilteredOptionsForLevel, topic, removeTopic }) => {
  const [newTopicName, setNewTopicName] = React.useState('')

  const options = getFilteredOptionsForLevel(levelNumber, topic.id)

  function handleNewTopicNameChange(e) {
    setNewTopicName(e.target.value)
  }

  function handleClickAddTopic(e) {
    e.preventDefault()
    const newTopic = {
      level: 1,
      name: newTopicName
    }
    createNewTopic(newTopic)
    setNewTopicName('')
  }

  const handleClickSelectTopic = (id) => {
    selectTopic(id, levelNumber)
  }

  function handleClickRemoveTopic(e) {
    removeTopic(levelNumber)
  }

  const selectedOption = topic

  let selectedOptionElement = <div className="selected-option" />
  let newTopicField

  if (selectedOption) {
    selectedOptionElement = (<div className="selected-option" >
      <span>{selectedOption.name}</span>
      <button aria-label="remove topic" className="interactive-wrapper" onClick={handleClickRemoveTopic} type="button"><i className="fas fa-times" /></button>
    </div>)
  }

  if (levelNumber === 1) {
    let buttonClassName = "quill-button secondary small outlined"
    if (!newTopicName.length) {
      buttonClassName+= ' disabled'
    }
    newTopicField = (<div className="new-topic-field">
      <span>New Topic Level 1</span>
      <input disabled={!options.length} onChange={handleNewTopicNameChange} value={newTopicName} />
      <button className={buttonClassName} disabled={!options.length} onClick={handleClickAddTopic}>Add</button>
    </div>)
  }

  return (
    <div className="topic-column">
      <label>Topic Level {levelNumber}</label>
      {selectedOptionElement}
      <div>
        {
          options.map((option, i) => {
            let clickEventHelper = () => {
              handleClickSelectTopic(option.id)
            };
            return (
              <button className="record-cell" key={i} onClick={clickEventHelper} onKeyDown={clickEventHelper} type="button">
                {option.name}
              </button>
            )
          })
        }
      </div>
      {newTopicField}
    </div>
  );
}

export default TopicColumn
