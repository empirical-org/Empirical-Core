import * as React from 'react';

import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report';
import { ReactTable, } from '../../Shared/index'
import { getTimeSpent } from '../../Teacher/helpers/studentReports';

export const StandardsReportsTable = ({ data, isFreemiumView }) => {

  const columns = [
    {
      Header: 'Standard level',
      accessor: 'standard_level_name',
      maxWidth: 160
    }, {
      Header: 'Standard name',
      accessor: 'name',
      Cell: ({ row }) => <span className="show-overflow">{row.original.name}</span>,
    }, {
      Header: 'Students',
      accessor: 'total_student_count',
      resizable: false,
      maxWidth: 130
    }, {
      Header: 'Proficient',
      accessor: 'proficient_count',
      resizable: false,
      maxWidth: 130,
      Cell: ({row}) => `${row.original.proficient_count  } of ${  row.original.total_student_count}`,
    }, {
      Header: 'Activities',
      accessor: 'total_activity_count',
      resizable: false,
      maxWidth: 160,
      Cell: ({row}) => Number(row.original.total_activity_count),
    }, {
      Header: "Time spent",
      accessor: 'timespent',
      Cell: ({row}) => {
        const value = row.original.timespent;
        return (getTimeSpent(value))
      },
      resizable: false,
      maxWidth: 130
    }
  ];

  if (data && data.length) {
    const defaultSortedRule = isFreemiumView ? [{ id: 'total_activity_count', desc: true, }] : [{ id: 'last_active', desc: true, }]
    return (
      <div key={`${data.length}-length-for-activities-scores-by-classroom`}>
        <ReactTable
          className="admin-standards progress-report has-green-arrow"
          columns={columns}
          data={data}
          defaultPageSize={100}
          disableSortBy={isFreemiumView}
          defaultSorted={defaultSortedRule}
          minRows={1}
          showPagination={!isFreemiumView}
          showPaginationBottom={!isFreemiumView}
        />
      </div>
    );
  }
  return <EmptyStateForReport  />;
};

export default StandardsReportsTable;
