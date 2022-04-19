import React from 'react';
import moment from 'moment';

import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report';
import { ReactTable, } from '../../Shared/index'

const StandardsReportsTable = ({ data, }) => {
  const columns = [
    {
      Header: 'Standard Level',
      accessor: 'standard_level_name',
    }, {
      Header: 'Standard Name',
      accessor: 'name',
    }, {
      Header: 'Students',
      accessor: 'total_student_count',
      resizable: false,
    }, {
      Header: 'Proficient',
      accessor: 'proficient_count',
      resizable: false,
      Cell: ({row}) => `${row.original.proficient_count  } of ${  row.original.total_student_count}`,
    }, {
      Header: 'Activities',
      accessor: 'total_activity_count',
      resizable: false,
      Cell: ({row}) => Number(row.original.total_activity_count),
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
          showPagination
          showPaginationBottom
        />
      </div>
    );
  }
  return <EmptyStateForReport  />;
};

export default StandardsReportsTable;
