import React from 'react';

import ConceptReportsTable from './concept_reports_table';

import { ReportHeader } from '../../Shared';
import ItemDropdown from '../../Teacher/components/general_components/dropdown_selectors/item_dropdown';

const ConceptReports = ({
  csvData,
  schoolNames,
  switchSchool,
  selectedSchool,
  teacherNames,
  switchTeacher,
  selectedTeacher,
  classroomNames,
  switchClassroom,
  selectedClassroom,
  filteredConceptReportsData,
}) => (
  <div className="admin-report-container">
    <ReportHeader
      title="School Concept Reports"
      tooltipText="Each question on Quill targets a specific writing concept. This report shows the number of times the student correctly or incorrectly used the targeted concept to answer the question. You can print this report by downloading a PDF file or export this data by downloading a CSV file. <br/><br/> These reports are updated nightly."
      csvData={csvData}
    />
    <div className="dropdowns-container">
      <ItemDropdown
        callback={switchSchool}
        className="admin-concept-dropdown bordered-dropdown"
        dropdownId="cr-school-select-dropdown"
        items={schoolNames}
        selectedItem={selectedSchool}
      />
      <ItemDropdown
        callback={switchTeacher}
        className="admin-concept-dropdown bordered-dropdown"
        dropdownId="cr-teacher-select-dropdown"
        items={teacherNames}
        selectedItem={selectedTeacher}
      />
      <ItemDropdown
        callback={switchClassroom}
        className="admin-concept-dropdown bordered-dropdown"
        dropdownId="cr-classroom-select-dropdown"
        items={classroomNames}
        selectedItem={selectedClassroom}
      />
    </div>
    <ConceptReportsTable data={filteredConceptReportsData} />
  </div>
);

export default ConceptReports;
