import * as React from 'react';
import ReactTable from 'react-table';
import * as moment from 'moment';

import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report';
import 'react-table/react-table.css';
import { sortByLastName, sortFromSQLTimeStamp } from '../../../modules/sortingMethods';

import { Link } from 'react-router-dom';

interface ActivityScoresTableProps {
  data: Array<Object>;
}

const ActivityScoresTable = ({ data }) => {
  let columns = [
    {
      Header: 'Student',
      accessor: 'students_name',
      resizable: false,
      minWidth: 120,
      sortMethod: sortByLastName,
      Cell: (row) => {
        const classroomId = row.original.classroom_id;
        const studentId = row.original.student_id;
        const to = {
          pathname: '/teachers/admin_dashboard/district_activity_scores/student_overview',
          search: `?classroom_id=${classroomId}&student_id=${studentId}`
        }

        return <Link to={to}>{row.original.students_name}</Link>;
      },
    }, {
      Header: "Completed",
      accessor: 'activity_count',
      resizable: false,
      minWidth: 90,
      Cell: row => Number(row.original.activity_count),
    }, {
      Header: "Score",
      accessor: 'average_score',
      resizable: false,
      minWidth: 60,
      Cell: row => {
        const value = Math.round(parseFloat(row.original.average_score) * 100);
        return (isNaN(value) ? '--' : value + '%');
      }
    }, {
      Header: "School",
      accessor: 'schools_name',
      resizable: false,
      Cell: row => row.original.schools_name,
    }, {
      Header: 'Teacher',
      accessor: 'teachers_name',
      resizable: false,
      sortMethod: sortByLastName,
      Cell: row => row.original.teachers_name,
    }, {
      Header: "Class",
      accessor: 'classroom_name',
      resizable: false,
      Cell: row => row.original.classroom_name,
    }, {
      Header: "Last Active",
      accessor: 'last_active',
      resizable: false,
      minWidth: 90,
      Cell: (row) => {
        if (row.original.last_active) {
          return moment(row.original.last_active).format("MM/DD/YYYY");
        }
        return '--';
      },
      sortMethod: sortFromSQLTimeStamp,
    },
  ];

  if (data && data.length) {
    return (<div key={`${data.length}-length-for-activities-scores-by-classroom`}>
      <ReactTable
        className='progress-report activity-scores-table has-green-arrow'
        columns={columns}
        data={data}
        defaultPageSize={100}
        defaultSorted={[{id: 'last_active', desc: true}]}
        minRows={1}
        showPageSizeOptions={false}
        showPagination={true}
        showPaginationBottom={true}
        showPaginationTop={false}
      />
    </div>)
  } else {
    return <EmptyStateForReport />
  }
};

export default ActivityScoresTable;
