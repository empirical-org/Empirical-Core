import React from 'react'
import _ from 'underscore'

import DropdownFilter from './dropdown_filter.jsx'

export default class ProgressReportFilters extends React.Component {
  activeFilter = (selected, options) => {
    if(!selected || !options) { return ''; }
    if(selected.value != options[0].value) {
      return 'actively-selected';
    } else {
      return '';
    }
  };

  classroomFilter = () => {
    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 classroom-filter" key="classroom-filter">
        <DropdownFilter className={this.activeFilter(this.props.selectedClassroom, this.props.classroomFilters)} options={this.props.classroomFilters} selectedOption={this.props.selectedClassroom} selectOption={this.props.selectClassroom} />
      </div>
    );
  };

  unitFilter = () => {
    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 unit-filter" key="unit-filter">
        <DropdownFilter className={this.activeFilter(this.props.selectedUnit, this.props.unitFilters)} options={this.props.unitFilters} selectedOption={this.props.selectedUnit} selectOption={this.props.selectUnit} />
      </div>
    );
  };

  studentFilter = () => {
    return (
      <div className="col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 student-filter" key="student-filter">
        <DropdownFilter className={this.activeFilter(this.props.selectedStudent, this.props.studentFilters)} options={this.props.studentFilters} selectedOption={this.props.selectedStudent} selectOption={this.props.selectStudent} />
      </div>
    );
  };

  render() {
    var filters = [];
    if (_.include(this.props.filterTypes, 'classroom')) {
      filters.push(this.classroomFilter());
    }

    if (_.include(this.props.filterTypes, 'unit')) {
      filters.push(this.unitFilter());
    }

    if (_.include(this.props.filterTypes, 'student')) {
      filters.push(this.studentFilter());
    }

    return (
      <div className="row activity-page-dropdown-wrapper progress-report-filters">
        {filters}
      </div>
    );
  }
}
