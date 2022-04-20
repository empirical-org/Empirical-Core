import React from 'react';

import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report';
import { sortTableByLastName } from '../../../modules/sortingMethods';
import { ReactTable, } from '../../Shared'

const ConceptReportsTable = ({ data, }) => {
  const columns = [
    {
      Header: 'Student',
      accessor: 'student_name',
      resizable: false,
      sortType: sortTableByLastName,
    }, {
      Header: 'Teacher',
      accessor: 'teacher_name',
      resizable: false,
      sortType: sortTableByLastName,
    }, {
      Header: 'Classroom',
      accessor: 'classroom_name',
      resizable: false,
    }, {
      Header: 'School',
      accessor: 'school_name',
      resizable: false,
    }, {
      Header: 'Correct',
      accessor: 'correct',
      resizable: false,
      Cell: ({row}) => Number(row.original.correct),
    }, {
      Header: 'Incorrect',
      accessor: 'incorrect',
      resizable: false,
      Cell: ({row}) => Number(row.original.incorrect),
    }, {
      Header: 'Success Rate',
      accessor: 'percentage',
      resizable: false,
      Cell: ({row}) => `${row.original.percentage}%`,
    }
  ];

  if (data && data.length) {
    return (
      <div key={`${data.length}-length-for-activities-scores-by-classroom`}>
        <ReactTable
          className="progress-report has-green-arrow"
          columns={columns}
          data={data}
          defaultPageSize={100}
          defaultSorted={[{ id: 'last_active', desc: true, }]}
          showPagination
          showPaginationBottom
        />
      </div>
    );
  }
  return <EmptyStateForReport />;
};

export default ConceptReportsTable;
