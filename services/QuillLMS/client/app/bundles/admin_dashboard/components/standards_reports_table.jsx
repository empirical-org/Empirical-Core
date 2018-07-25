import React from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import 'react-table/react-table.css';
import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report';

const StandardsReportsTable = ({ data, }) => {
  const columns = [
    {
      Header: 'Standard Level',
      accessor: 'section_name',
      resizable: false,
      Cell: row => row.original.section_name,
    }, {
      Header: 'Standard Name',
      accessor: 'name',
      Cell: row => row.original.name,
    }, {
      Header: 'Teacher Name',
      accessor: 'teacher_name',
      Cell: row => row.original.teacher_name,
    }, {
      Header: 'Classroom Name',
      accessor: 'classroom_name',
      Cell: row => row.original.classroom_name,
    }, {
      Header: 'School Name',
      accessor: 'school_name',
      Cell: row => row.original.school_name,
    }, {
      Header: 'Students',
      accessor: 'total_student_count',
      // resizable: false,
      width: 80,
      Cell: row => row.original.total_student_count,
    }, {
      Header: 'Proficent',
      accessor: 'proficient_count',
      resizable: false,
      Cell: row => `${row.original.proficient_count  } of ${  row.original.total_student_count}`,
    }, {
      Header: 'Activities',
      accessor: 'total_activity_count',
      resizable: false,
      width: 80,
      Cell: row => Number(row.original.total_activity_count),
    }
  ];

  if (data && data.length) {
    return (<div key={`${data.length}-length-for-activities-scores-by-classroom`}>
      <ReactTable
data={data}
        columns={columns}
        showPagination
        defaultSorted={[{ id: 'last_active', desc: true ,}]}
        showPaginationTop={false}
        showPaginationBottom
        showPageSizeOptions={false}
        defaultPageSize={100}
        minRows={1}
        className="progress-report has-green-arrow"
      />
    </div>);
  }
  return <EmptyStateForReport  />;
};

export default StandardsReportsTable;
