import React from 'react';
import _ from 'underscore';

import { DropdownInput } from '../../../Shared/index';

export default class ProgressReportFilters extends React.Component {
  activeFilter = (selected, options) => {
    if(!selected || !options) { return ''; }
    if(selected.value !== options[0].value) {
      return 'actively-selected';
    } else {
      return '';
    }
  };

  classroomFilter = () => {
    const { selectedClassroom, classroomFilters, selectClassroom, } = this.props
    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 classroom-filter" key="classroom-filter">
        <DropdownInput
          className={this.activeFilter(selectedClassroom, classroomFilters)}
          handleChange={selectClassroom}
          options={classroomFilters}
          value={selectedClassroom}
        />
      </div>
    );
  };

  unitFilter = () => {
    const { selectedUnit, unitFilters, selectUnit, } = this.props

    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 unit-filter" key="unit-filter">
        <DropdownInput
          className={this.activeFilter(selectedUnit, unitFilters)}
          handleChange={selectUnit}
          options={unitFilters}
          value={selectedUnit}
        />
      </div>
    );
  };

  studentFilter = () => {
    const { selectedStudent, studentFilters, selectStudent, } = this.props

    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 student-filter" key="student-filter">
        <DropdownInput
          className={this.activeFilter(selectedStudent, studentFilters)}
          handleChange={selectStudent}
          options={studentFilters}
          value={selectedStudent}
        />
      </div>
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
      <div className="row activity-page-dropdown-wrapper progress-report-filters">
        {filters}
      </div>
    );
  }
}
