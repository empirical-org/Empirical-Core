import React from 'react';
import ReactTable from 'react-table';
import EmptyStateForReport from 'bundles/HelloWorld/components/progress_reports/empty_state_for_report';
import moment from 'moment';
import 'react-table/react-table.css';
import { sortByLastName, sortFromSQLTimeStamp } from 'modules/sortingMethods';

const ActivityScoresTable = ({ data }) => {
  let columns = [
    {
      Header: 'Student',
      accessor: 'students_name',
      resizable: false,
      sortMethod: sortByLastName,
      Cell: row => row.original.students_name,
    }, {
      Header: "Activities Completed",
      accessor: 'activity_count',
      resizable: false,
      minWidth: 120,
      Cell: row => Number(row.original.activity_count),
    }, {
      Header: "Overall Score",
      accessor: 'average_score',
      resizable: false,
      minWidth: 90,
      Cell: row => {
        const value = Math.round(parseFloat(row.original.average_score) * 100);
        return (isNaN(value) ? '--' : value + '%');
      }
    }, {
      Header: "Last Active",
      accessor: 'last_active',
      resizable: false,
      minWidth: 90,
      Cell: row => row.last_active ? moment(row.last_active).format("MM/DD/YYYY") : <span/>,
      sortMethod: sortFromSQLTimeStamp,
    }, {
      Header: 'Teacher',
      accessor: 'teachers_name',
      resizable: false,
      sortMethod: sortByLastName,
      Cell: row => row.original.teachers_name,
    }, {
      Header: "School",
      accessor: 'schools_name',
      resizable: false,
      Cell: row => row.original.schools_name,
    }, {
      Header: "Class",
      accessor: 'classroom_name',
      resizable: false,
      Cell: row => row.original.classroom_name,
    },
  ];

  if (data.length) {
    return (<div key={`${data.length}-length-for-activities-scores-by-classroom`}>
      <ReactTable data={data}
        columns={columns}
        showPagination={false}
        defaultSorted={[{id: 'last_active', desc: true}]}
        showPaginationTop={false}
        showPaginationBottom={false}
        showPageSizeOptions={false}
        defaultPageSize={data.length}
        className='progress-report has-green-arrow'/>
      </div>)
  } else {
    return <EmptyStateForReport/>
  }

};

export default ActivityScoresTable;
