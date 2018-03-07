import React from 'react';
import ReactTable from 'react-table';
import EmptyStateForReport from 'bundles/HelloWorld/components/progress_reports/empty_state_for_report';
import moment from 'moment';
import 'react-table/react-table.css';
import { sortFromSQLTimeStamp } from 'modules/sortingMethods';

const StandardsReportsTable = ({ data }) => {
  let columns = [
    {
      Header: 'Standard Level',
      accessor: 'section_name',
      resizable: false,
      Cell: row => row.original.student_name,
    }, {
      Header: 'Standard Name',
      accessor: 'name',
      resizable: false,
      Cell: row => row.original.teacher_name,
    }, {
      Header: 'Students',
      accessor: 'total_student_count',
      resizable: false,
      Cell: row => row.original.classroom_name,
    }, {
      Header: 'Proficent',
      accessor: 'proficient_count',
      resizable: false,
      Cell: row => row.original.school_name,
    }, {
      Header: 'Activities',
      accessor: 'total_activity_count',
      resizable: false,
      Cell: row => Number(row.original.correct),
    },
  ];

  if (data && data.length) {
    return (<div key={`${data.length}-length-for-activities-scores-by-classroom`}>
      <ReactTable data={data}
        columns={columns}
        showPagination={true}
        defaultSorted={[{id: 'last_active', desc: true}]}
        showPaginationTop={false}
        showPaginationBottom={true}
        showPageSizeOptions={false}
        defaultPageSize={100}
        minRows={1}
        className='progress-report has-green-arrow'/>
      </div>)
  } else {
    return <EmptyStateForReport/>
  }
};

export default StandardsReportsTable;
