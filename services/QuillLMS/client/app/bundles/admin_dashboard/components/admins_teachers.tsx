import * as React from 'react';
import TeacherLinks from './teacher_links';
import UnlinkLink from './unlink_link';

import { ReactTable, DropdownInput, } from '../../Shared/index'

interface AdminsTeachersProps {
  data: Array<Object>;
  isValid: boolean;
  refreshData(): void;
}

const ALL_SCHOOLS_OPTION = 'All Schools'

const AdminsTeachers: React.SFC<AdminsTeachersProps> = ({
  data,
  isValid,
  refreshData,
}) => {
  const [selectedSchool, setSelectedSchool] = React.useState(ALL_SCHOOLS_OPTION)

  function onChangeSelectedSchool(selectedSchoolOption) { setSelectedSchool(selectedSchoolOption.value) }

  const teacherColumns = [
    {
      Header: 'Name',
      accessor: 'name',
      resizable: false,
    },
    {
      Header: 'School',
      accessor: 'school',
      resizable: false,
    },
    {
      Header: 'Students',
      accessor: 'number_of_students',
      resizable: false,
      maxWidth: 90,
    },
    {
      Header: 'Activities Completed',
      accessor: 'number_of_activities_completed',
      minWidth: 165,
      resizable: false,
    },
    {
      Header: 'Time Spent',
      accessor: 'time_spent',
      maxWidth: 120,
      resizable: false,
    },
    {
      Header: 'Log In As Teacher',
      accessor: 'link_components',
      Cell: ({row}) => {
        return <TeacherLinks isValid={isValid} links={row.original.links} />;
      },
      resizable: false,
    },
    {
      Header: 'Manage',
      Cell: ({row}) => {
        return <UnlinkLink id={row.original.id} refreshData={refreshData} />;
      },
      minWidth: 130,
      resizable: false,
    }
  ];

  const schoolOptions = _.uniq([ALL_SCHOOLS_OPTION, ...data.map(d => d.school)]).map(school => ({ value: school, label: school}))

  const filteredData = selectedSchool === ALL_SCHOOLS_OPTION ? data : data.filter(d => d.school === selectedSchool)

  return (
    <div id="teacher_account_access">
      <div className="header-and-dropdown">
        <h2>Teacher Account Access</h2>
        <DropdownInput
          handleChange={onChangeSelectedSchool}
          options={schoolOptions}
          value={schoolOptions.find(so => so.value === selectedSchool)}
        />
      </div>
      <p>
        <span className="warning">Warning:</span> Any changes you make when you
        access a teacher account will impact the teacher and student facing
        dashboards.
      </p>
      <p>
        This list provides you with the ability to sign in to all of the
        teacher accounts for the schools you have admin access.
      </p>
      <div className="admins-teachers">
        <ReactTable
          className='progress-report has-green-arrow'
          columns={teacherColumns}
          data={filteredData}
        />
      </div>
    </div>
  );
};

export default AdminsTeachers;
