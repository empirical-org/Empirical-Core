import * as React from 'react';
import TeacherLinks from './teacher_links';
import ReactTable from 'react-table';

interface AdminsTeachersProps {
  data: Array<Object>;
  isValid: boolean;
}

const AdminsTeachers: React.SFC<AdminsTeachersProps> = ({
  data,
  isValid
}) => {
  const teacherColumns = [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'School',
      accessor: 'school',
    },
    {
      Header: 'Students',
      accessor: 'number_of_students',
    },
    {
      Header: 'Questions Completed',
      accessor: 'number_of_questions_completed',
    },
    {
      Header: 'Time Spent',
      accessor: 'time_spent',
    },
    {
      Header: 'View As Teacher',
      accessor: 'link_components',
      Cell: (row) => {
        return <TeacherLinks links={row.original.links} isValid={isValid} />;
      },
    }
  ];

  return (
    <div id="teacher_account_access">
      <h2>Teacher Account Access</h2>
      <p>
        <span className="warning">Warning:</span> Any changes you make when you
        access a teacher account will impact the teacher and student facing
        dashboards.
      </p>
      <p>
        This list provides you with the ability to sign in to all of the
        teacher accounts for the schools you have admin access.
      </p>
      <div className={'admins-teachers'}>
        <ReactTable data={data}
          columns={teacherColumns}
          showPagination={false}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          defaultPageSize={data.length}
          className='progress-report has-green-arrow'
        />
      </div>
    </div>
  );
};

export default AdminsTeachers;
