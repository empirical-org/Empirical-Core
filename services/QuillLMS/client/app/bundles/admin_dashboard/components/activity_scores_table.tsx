import * as React from 'react';
import { Link } from 'react-router-dom';
import * as moment from 'moment';

import EmptyStateForReport from '../../Teacher/components/progress_reports/empty_state_for_report'
import { sortTableByLastName, sortTableFromSQLTimeStamp } from '../../../modules/sortingMethods';
import { ReactTable, } from '../../Shared/index'
import { getTimeSpent } from '../../Teacher/helpers/studentReports';

interface ActivityScoresTableProps {
  data: Array<Object>;
}

const ActivityScoresTable = ({ data }) => {
  let columns = [
    {
      Header: 'Student',
      accessor: 'students_name',
      resizable: false,
      sortType: sortTableByLastName,
      Cell: ({row}) => {
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
      Cell: ({row}) => Number(row.original.activity_count),
    }, {
      Header: "Score",
      accessor: 'average_score',
      resizable: false,
      maxWidth: 90,
      Cell: ({row}) => {
        const value = Math.round(parseFloat(row.original.average_score) * 100);
        return (isNaN(value) ? '--' : value + '%');
      }
    }, {
      Header: "School",
      accessor: 'schools_name',
      resizable: false,
    }, {
      Header: 'Teacher',
      accessor: 'teachers_name',
      resizable: false,
      sortType: sortTableByLastName,
    }, {
      Header: "Class",
      accessor: 'classroom_name',
      resizable: false,
    }, {
      Header: "Time spent",
      accessor: 'timespent',
      Cell: ({row}) => {
        const value = row.original.timespent;
        return (getTimeSpent(value))
      }
    }, {
      Header: "Last active",
      accessor: 'last_active',
      resizable: false,
      minWidth: 90,
      Cell: ({row}) => {
        if (row.original.last_active) {
          return moment(row.original.last_active).format("MM/DD/YYYY");
        }
        return '--';
      },
      sortType: sortTableFromSQLTimeStamp,
    },
  ];

  if (data && data.length) {
    return (
      <div key={`${data.length}-length-for-activities-scores-by-classroom`}>
        <ReactTable
          className='progress-report activity-scores-table has-green-arrow'
          columns={columns}
          data={data}
          defaultPageSize={100}
          defaultSorted={[{id: 'last_active', desc: true}]}
          showPaginationBottom={true}
        />
      </div>
    )
  } else {
    return <EmptyStateForReport />
  }
};

export default ActivityScoresTable;
