import * as React from 'react';
import TeacherLinks from './teacher_links';
import UnlinkLink from './unlink_link';
import _ from 'underscore'

import { ReactTable, DropdownInput, } from '../../Shared/index'

interface AdminsTeachersProps {
  data: Array<Object>;
  refreshData(): void;
}

const ALL_SCHOOLS_OPTION = 'All Schools'

export const AdminsTeachers: React.SFC<AdminsTeachersProps> = ({
  data,
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
        return <TeacherLinks isValid={row.original.has_valid_subscription} links={row.original.links} />;
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

  const schoolOptions = _.uniq([ALL_SCHOOLS_OPTION, ...data.map((d: { school: string }) => d.school)]).map(school => ({ value: school, label: school}))
  const filteredData = selectedSchool === ALL_SCHOOLS_OPTION ? data : data.filter((d: { school: string }) => d.school === selectedSchool)

  return (
    <div className="teacher-account-access-container">
      <h2>Teacher Account Access</h2>
      <DropdownInput
        handleChange={onChangeSelectedSchool}
        isSearchable={true}
        options={schoolOptions}
        value={schoolOptions.find(so => so.value === selectedSchool)}
      />
      <div className="admins-teachers">
        <ReactTable
          className='progress-report has-green-arrow'
          columns={teacherColumns}
          data={filteredData}
        />
      </div>
      <p className="warning-section">
        <span className="warning">Warning:</span> Any changes you make when you
        access a teacher account will impact the teacher and student facing
        dashboards. This list provides you with the ability to sign in to all of the
        teacher accounts for the schools you have admin access.
        <strong>The data below represents usage from this school year, beginning July 1st.</strong>
      </p>
    </div>
  );
};

export default AdminsTeachers;
