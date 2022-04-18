import * as React from 'react'
import { ReactTable, TextFilter, } from '../../../Shared/index'

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
      Header: 'Name',
      accessor: 'name',
      key: 'name',
      Cell: ({row}) => (<div className={`record-cell ${selectedOption && selectedOption.id === row.original.id  ? 'selected' : ''}`} onClick={() => selectTopic(row.original.id)}>{row.original.name}</div>),
      sortType:  (a, b) => (a && b ? a.original.name.localeCompare(b.original.name) : 0),
      Filter: TextFilter,
      filter: (rows, idArray, filterValue) => {
        return rows.filter(row => {
          return row.original.name ? row.original.name.toLowerCase().includes(filterValue.toLowerCase()) : ''
        })
      },
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

  return (
    <div className="topic-column">
      <label>Topic Level {levelNumber}</label>
      {selectedOptionElement}
      <ReactTable
        columns={columns(selectedOption)}
        data={options}
        defaultFilterMethod={(filter, row) => row._original.name ? row._original.name.toLowerCase().includes(filter.value.toLowerCase()) : ''}
        filterable
      />
      {newTopicField}
    </div>
  );
}

export default TopicColumn
