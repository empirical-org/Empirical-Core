import moment from 'moment';
import * as React from 'react';

import RecordBox from './recordBox';
import { STANDARD, STANDARD_CATEGORY, STANDARD_LEVEL, tableSortWordsThatIncludeNumbers } from './shared';

import { getColumnWidth } from '../../shared/getColumnWidth';

import { momentFormatConstants, ReactTable, Tooltip } from '../../../../Shared/index';

const standardCategoryTooltipText = "Each standard is assigned a standard category. The standard category displays in a featured activity pack page as the \"concept\" for each activity. The standard category that gets displayed is determined by the standard that has been assigned to the activity.  Standard categories also display as the concepts of the pack, shown in the white box on the right of an activity pack page. Although standard categories are called \"concepts\" in a featured activity pack page, they are not the same concepts that are used to filter or order activities in the custom activity pack page."

const standardLevelTooltipText = "Standards are grouped by their grade level. The standard level displays to teachers on the Standards data report and is used as an activity attribute filter, called CCSS Grade Level, on the custom activity pack page."

function columns(selectRecord, data) {
  return [
    {
      Header: <Tooltip tooltipText={standardLevelTooltipText} tooltipTriggerText="Standard Level" />,
      accessor: 'standard_level_name',
      defaultSortOrder: 'ascend',
      key: 'standardLevelName',
      Cell: ({row}) => (<button className="interactive-wrapper" onClick={() => selectRecord(row.original.standard_level_id, STANDARD_LEVEL)}>{row.original.standard_level_name}</button>),
      sortType: tableSortWordsThatIncludeNumbers('standard_level_name'),
      width: getColumnWidth('standard_level_name', "Standard Level", data)
    },
    {
      Header: 'Activities',
      accessor: 'standard_level_activity_count',
      key: 'standardLevelActivityCount',
      sortType:  (a, b) => (a.original.standard_level_activity_count - b.original.standard_level_activity_count),
      width: getColumnWidth('standard_level_activity_count', "Activities", data)
    },
    {
      Header: <Tooltip tooltipText={standardCategoryTooltipText} tooltipTriggerText="Standard Category" />,
      accessor: 'standard_category_name',
      key: 'standardCategoryName',
      Cell: ({row}) => (<button className="interactive-wrapper" onClick={() => selectRecord(row.original.standard_category_id, STANDARD_CATEGORY)}>{row.original.standard_category_name}</button>),
      sortType: tableSortWordsThatIncludeNumbers('standard_category_name'),
      width: getColumnWidth('standard_category_name', "Standard Category", data)
    },
    {
      Header: 'Activities',
      accessor: 'standard_category_activity_count',
      key: 'standardCategoryActivityCount',
      sortType:  (a, b) => (a.original.standard_category_activity_count - b.original.standard_category_activity_count),
      width: getColumnWidth('standard_category_activity_count', "Activities", data)
    },
    {
      Header: 'Standard',
      accessor: 'name',
      key: 'standardName',
      Cell: ({row}) => (<button className="interactive-wrapper" onClick={() => selectRecord(row.original.id, STANDARD)}>{row.original.name}</button>),
      sortType: tableSortWordsThatIncludeNumbers(),
      width: getColumnWidth('name', "Standard", data)
    },
    {
      Header: 'Activities',
      accessor: 'activity_count',
      key: 'standardActivityCount',
      sortType:  (a, b) => (a.original.activity_count - b.original.activity_count),
      width: getColumnWidth('activity_count', "Activities", data)
    },
    {
      Header: 'Created At',
      accessor: 'created_at',
      key: 'created_at',
      Cell: ({row}) => moment(row.original.created_at).format(momentFormatConstants.MONTH_DAY_YEAR),
      sortType:  (a, b) => (new Date(a.original.created_at) - new Date(b.original.created_at)),
      width: getColumnWidth('created_at', "Created At", data)
    }
  ]
}

const StandardsTable = ({ searchValue, standardCategories, standardLevels, recordTypes, standards, }) => {
  const [selectedRecordId, setSelectedRecordId] = React.useState(null)
  const [selectedRecordType, setSelectedRecordType] = React.useState(null)

  function closeRecordBox() {
    setSelectedRecordId(null)
    setSelectedRecordType(null)
  }

  function selectRecord(id, recordType) {
    setSelectedRecordId(id)
    setSelectedRecordType(recordType)
  }

  let recordBox

  const sharedRecordBoxProps = {
    closeRecordBox,
    standardCategories: standardCategories.filter(sc => sc.visible),
    standardLevels: standardLevels.filter(sl => sl.visible),
    standards: standards.filter(s => s.visible),
    recordType: selectedRecordType
  }

  if (selectedRecordId) {
    const recordType = recordTypes.find(rt => rt.recordType === selectedRecordType)
    const recordBoxProps = {
      ...sharedRecordBoxProps,
      originalRecord: recordType.records.find(r => r.id === selectedRecordId),
      saveRecordChanges: recordType.saveChanges,
      recordTypeAttribute: recordType.attribute
    }
    recordBox = <RecordBox {...recordBoxProps} />
  }

  const records = standards.map(s => {
    const standardLevel = standardLevels.find(sl => sl.id === s.standard_level_id)
    const standardCategory = standardCategories.find(sc => sc.id === s.standard_category_id)
    s.standard_level_name = standardLevel ? standardLevel.name : null
    s.standard_level_activity_count = standardLevel ? standardLevel.activity_count : null
    s.standard_category_name = standardCategory ? standardCategory.name : null
    s.standard_category_activity_count = standardCategory ? standardCategory.activity_count : null
    return s
  })

  const filteredRecords = records.filter(r => {
    const standardLevelNameMatchesSearch = r.standard_level_name && r.standard_level_name.toLowerCase().includes(searchValue.toLowerCase())
    const standardCategoryNameMatchesSearch = r.standard_category_name && r.standard_category_name.toLowerCase().includes(searchValue.toLowerCase())
    const standardNameMatchesSearch = r.name.toLowerCase().includes(searchValue.toLowerCase())
    return r.visible === true && (standardLevelNameMatchesSearch || standardCategoryNameMatchesSearch || standardNameMatchesSearch)
  })

  return (
    <div className="standard-columns">
      <ReactTable
        className="records-table"
        columns={columns(selectRecord, filteredRecords)}
        data={filteredRecords}
        defaultPageSize={filteredRecords.length}
      />
      <div className="record-box-container">
        {recordBox}
      </div>
    </div>
  )
}

export default StandardsTable
