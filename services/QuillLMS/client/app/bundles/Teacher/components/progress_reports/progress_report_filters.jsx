import React from 'react';
import _ from 'underscore';

import { DropdownInput, } from '../../../Shared/index';

export default class ProgressReportFilters extends React.Component {
  activeFilter = (selected, options) => {
    if(!selected || !options) { return ''; }
    if(selected.value !== options[0].value) {
      return 'actively-selected bordered-dropdown';
    } else {
      return 'bordered-dropdown';
    }
  };

  classroomFilter = () => {
    const { selectedClassroom, classroomFilters, selectClassroom, } = this.props
    return (
      <DropdownInput
        className={`${this.activeFilter(selectedClassroom, classroomFilters)} dropdown-with-icon`}
        handleChange={selectClassroom}
        key="classroom-filter"
        options={classroomFilters}
        value={selectedClassroom}
      />
    );
  };

  unitFilter = () => {
    const { selectedUnit, unitFilters, selectUnit, } = this.props

    return (
      <DropdownInput
        className={this.activeFilter(selectedUnit, unitFilters)}
        handleChange={selectUnit}
        key="unit-filter"
        options={unitFilters}
        value={selectedUnit}
      />
    );
  };

  studentFilter = () => {
    const { selectedStudent, studentFilters, selectStudent, } = this.props

    return (
      <DropdownInput
        className={this.activeFilter(selectedStudent, studentFilters)}
        handleChange={selectStudent}
        key="student-filter"
        options={studentFilters}
        value={selectedStudent}
      />
    );
  };

  render() {
    const { filterTypes, } = this.props
    let filters = [];
    if (_.include(filterTypes, 'classroom')) {
      filters.push(this.classroomFilter());
    }

    if (_.include(filterTypes, 'unit')) {
      filters.push(this.unitFilter());
    }

    if (_.include(filterTypes, 'student')) {
      filters.push(this.studentFilter());
    }

    return (
      <div className="progress-report-filters">
        {filters}
      </div>
    );
  }
}
