import * as React from 'react'

import { School, } from './shared'

import { DataTable } from '../../../Shared/index';

interface SchoolSelectorProps {
  schools: School[];
  setSelectedSchoolIds: (schoolIds) => void;
  selectedSchoolIds: number[];
}

const SchoolSelector = ({ schools, setSelectedSchoolIds, selectedSchoolIds }: SchoolSelectorProps) => {
  const checkRow = (id) => {
    if (selectedSchoolIds.includes(id)) { return }

    setSelectedSchoolIds([...selectedSchoolIds, id]);
  };

  const uncheckRow = (id) => {
    if (!selectedSchoolIds.includes(id)) { return }

    setSelectedSchoolIds(selectedSchoolIds.filter((selectedSchoolId) => selectedSchoolId !== id));
  };

  const checkAllRows = () => {
    setSelectedSchoolIds(schools.map((school) => school.id));
  };

  const uncheckAllRows = () => {
    setSelectedSchoolIds([]);
  };

  const selectedSchools = schools.map((school) => {
    school.checked = selectedSchoolIds.includes(school.id);
    return school
  });

  const headers = [{ name: "Schools", attribute: "name", width: "356px", rowSectionClassName: 'name', headerClassName: 'name' }]

  return (
    <DataTable
      checkAllRows={checkAllRows}
      checkRow={checkRow}
      headers={headers}
      rows={selectedSchools}
      showCheckboxes={true}
      uncheckAllRows={uncheckAllRows}
      uncheckRow={uncheckRow}
    />
  );
};

export default SchoolSelector
