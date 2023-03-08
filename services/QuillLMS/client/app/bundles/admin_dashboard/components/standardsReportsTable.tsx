import * as React from 'react';

import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report';
import { ReactTable, } from '../../Shared/index'
import { getTimeSpent } from '../../Teacher/helpers/studentReports';

const StandardsReportsTable = ({ data, isFreemiumView }) => {
  console.log("🚀 ~ file: standardsReportsTable.tsx:8 ~ StandardsReportsTable ~ isFreemiumView", isFreemiumView)
  const columns = [
    {
      Header: 'Standard level',
      accessor: 'standard_level_name',
    }, {
      Header: 'Standard name',
      accessor: 'name',
      minWidth: 350
    }, {
      Header: 'Students',
      accessor: 'total_student_count',
      resizable: false,
      maxWidth: 90
    }, {
      Header: 'Proficient',
      accessor: 'proficient_count',
      resizable: false,
      maxWidth: 120,
      Cell: ({row}) => `${row.original.proficient_count  } of ${  row.original.total_student_count}`,
    }, {
      Header: 'Activities',
      accessor: 'total_activity_count',
      resizable: false,
      maxWidth: 90,
      Cell: ({row}) => Number(row.original.total_activity_count),
    }, {
      Header: "Time spent",
      accessor: 'timespent',
      Cell: ({row}) => {
        const value = row.original.timespent;
        return (getTimeSpent(value))
      }
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
          defaultSorted={[{ id: 'last_active', desc: true ,}]}
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
