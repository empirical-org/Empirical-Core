import React from 'react';
import ReactTable from 'react-table';

import 'react-table/react-table.css';
import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report';
import { sortByLastName } from '../../../modules/sortingMethods';

const ConceptReportsTable = ({ data, }) => {
  const columns = [
    {
      Header: 'Student',
      accessor: 'student_name',
      resizable: false,
      sortMethod: sortByLastName,
      Cell: row => row.original.student_name,
    }, {
      Header: 'Teacher',
      accessor: 'teacher_name',
      resizable: false,
      Cell: row => row.original.teacher_name,
    }, {
      Header: 'Classroom',
      accessor: 'classroom_name',
      resizable: false,
      Cell: row => row.original.classroom_name,
    }, {
      Header: 'School',
      accessor: 'school_name',
      resizable: false,
      Cell: row => row.original.school_name,
    }, {
      Header: 'Correct',
      accessor: 'correct',
      resizable: false,
      Cell: row => Number(row.original.correct),
    }, {
      Header: 'Incorrect',
      accessor: 'incorrect',
      resizable: false,
      Cell: row => Number(row.original.incorrect),
    }, {
      Header: 'Success Rate',
      accessor: 'percentage',
      resizable: false,
      Cell: row => `${row.original.percentage}%`,
    }
  ];

  if (data && data.length) {
    return (<div key={`${data.length}-length-for-activities-scores-by-classroom`}>
      <ReactTable
        className="progress-report has-green-arrow"
        columns={columns}
        data={data}
        defaultPageSize={100}
        defaultSorted={[{ id: 'last_active', desc: true, }]}
        minRows={1}
        showPageSizeOptions={false}
        showPagination
        showPaginationBottom
        showPaginationTop={false}
      />
    </div>);
  }
  return <EmptyStateForReport />;
};

export default ConceptReportsTable;
