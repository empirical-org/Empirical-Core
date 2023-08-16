import * as React from 'react'

import { DataTable } from '../../Shared/index';

const CanvasInstanceSchoolsSelector = ({ schools, setSelectedSchoolIds, selectedSchoolIds }) => {
  const checkRow = (id) => {
    if (!selectedSchoolIds.includes(id)) {
      setSelectedSchoolIds([...selectedSchoolIds, id]);
    }
  };

  const uncheckRow = (id) => {
    if (selectedSchoolIds.includes(id)) {
      setSelectedSchoolIds(selectedSchoolIds.filter((selectedSchoolId) => selectedSchoolId !== id));
    }
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

  const headers = [{ "name": "Schools", "attribute": "name", "width": "356px" }]

  return (
    <DataTable
      rows={selectedSchools}
      headers={headers}
      showCheckboxes={true}
      checkRow={checkRow}
      uncheckRow={uncheckRow}
      uncheckAllRows={uncheckAllRows}
      checkAllRows={checkAllRows}
    />
  );
};

export default CanvasInstanceSchoolsSelector