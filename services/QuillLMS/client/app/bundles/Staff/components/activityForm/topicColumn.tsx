import * as React from 'react'
import ReactTable from 'react-table'

const TopicColumn = ({ createNewTopic, levelNumber, getFilteredOptionsForLevel, selectTopic, getSelectedOptionForLevel, }) => {
  const [newTopicName, setNewTopicName] = React.useState('')

  const options = getFilteredOptionsForLevel(levelNumber)

  function handleNewTopicNameChange(e) {
    setNewTopicName(e.target.value)
  }

  function handleClickAddTopic(e) {
    e.preventDefault()
    const newTopic = {
      level: 0,
      name: newTopicName
    }
    createNewTopic(newTopic)
    setNewTopicName('')
  }


  const columns = (selectedOption) => ([
    {
      title: 'Name',
      data: 'name',
      key: 'name',
      Cell: (props) => (<div className={`record-cell ${selectedOption && selectedOption.id === props.original.id  ? 'selected' : ''}`} onClick={() => selectTopic(props.original.id)}>{props.original.name}</div>),
      sortType:  (a, b) => (a.name.localeCompare(b.name)),
    }
  ]);

  const selectedOption = getSelectedOptionForLevel(levelNumber)

  let selectedOptionElement = <div className="selected-option" />
  let newTopicField

  if (selectedOption) {
    selectedOptionElement = (<div className="selected-option" >
      <span>{selectedOption.name}</span>
      <button className="interactive-wrapper" onClick={(e) => selectTopic(selectedOption.id, e)}><i className="fas fa-times" /></button>
    </div>)
  }

  if (levelNumber === 0) {
    let buttonClassName = "quill-button secondary small outlined"
    if (!newTopicName.length) {
      buttonClassName+= ' disabled'
    }
    newTopicField = (<div className="new-topic-field">
      <label>New Topic Level 0</label>
      <input disabled={!options.length} onChange={handleNewTopicNameChange} value={newTopicName} />
      <button className={buttonClassName} disabled={!options.length} onClick={handleClickAddTopic}>Add</button>
    </div>)
  }

  return (<div className="topic-column">
    <label>Topic Level {levelNumber}</label>
    {selectedOptionElement}
    <ReactTable
      columns={columns(selectedOption)}
      data={options}
      defaultFilterMethod={(filter, row) => row._original.name ? row._original.name.toLowerCase().includes(filter.value.toLowerCase()) : ''}
      filterable
      showPagination={false}
    />
    {newTopicField}
  </div>);
}

export default TopicColumn
