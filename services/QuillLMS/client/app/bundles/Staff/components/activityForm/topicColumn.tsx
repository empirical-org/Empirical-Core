import * as React from 'react'
import {  Table, Input, Button, Space  } from 'antd';

// code for the antd implementation adapted from their example here: https://ant.design/components/table/#components-table-demo-custom-filter-panel as of 11/18/20

const TopicColumn = ({ createNewTopic, levelNumber, getFilteredOptionsForLevel, selectTopic, getSelectedOptionForLevel, }) => {
  const [searchText, setSearchText] = React.useState('')
  const [newTopicName, setNewTopicName] = React.useState('')

  const searchInput = React.useRef(null)

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

  function getColumnSearchProps() {
    return ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            placeholder={`Search Level ${levelNumber}`}
            ref={searchInput}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
            value={selectedKeys[0]}
          />
          <Space>
            <Button
              icon={<i className="fas fa-search" />}
              onClick={() => handleSearch(selectedKeys, confirm)}
              size="small"
              style={{ width: 90 }}
              type="primary"
            >
              Search
            </Button>
            <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: <i className="fas fa-search" style={{color: '#d9d9d9'}} />,
      onFilter: (value, record) =>
        record.name
          ? record.name.toLowerCase().includes(value.toLowerCase())
          : '',
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.select(), 100);
        }
      }
    });
  }

  function handleSearch(selectedKeys, confirm) {
    confirm();
    setSearchText(selectedKeys[0])
  };

  function handleReset(clearFilters) {
    clearFilters();
    setSearchText('')
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (<div className="record-cell" onClick={() => selectTopic(record.id)}>{text}</div>),
      sorter:  (a, b) => (a.name.localeCompare(b.name)),
      defaultSortOrder: 'ascend',
      ...getColumnSearchProps(),
    }
  ];

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
    <Table
      bordered
      columns={columns}
      dataSource={options}
      pagination={false}
      rowClassName={(record, index) =>  (selectedOption && selectedOption.id === record.id  ? 'selected' : '')}
      scroll={{ y: 240 }}
      size="middle"
    />
    {newTopicField}
  </div>);
}

export default TopicColumn
