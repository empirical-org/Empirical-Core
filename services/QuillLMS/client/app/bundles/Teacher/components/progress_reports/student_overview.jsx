import l from 'lodash';
import moment from 'moment';
import React from 'react';
import _ from 'underscore';

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx';
import StudentOveriewTable from './student_overview_table.jsx';

import notLessonsOrDiagnostic from '../../../../modules/activity_classifications.js';
import { requestGet, } from '../../../../modules/request/index';
import { getTimeSpent } from '../../helpers/studentReports';
import getParameterByName from '../modules/get_parameter_by_name';
import LoadingSpinner from '../shared/loading_indicator.jsx';
import { singleUserIcon } from '../../../Shared/index';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      errors: false,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const query = l.get(location);
    const classroomId = l.get(query, 'classroom_id') || getParameterByName('classroom_id', window.location.href);
    const studentId = l.get(query, 'student_id') || getParameterByName('student_id', window.location.href);

    requestGet(
      `${process.env.DEFAULT_URL}/api/v1/progress_reports/student_overview_data/${studentId}/${classroomId}`,
      (body) => {
        this.setState({ loading: false, errors: body.errors, studentData: body.student_data, reportData: body.report_data, classroomName: body.classroom_name, });
      }
    )
  }

  backButton = () => {
    const { children, } = this.props;

    if (children) {
      return children;
    }
  };

  calculateCountAndAverage = () => {
    const { reportData } = this.state;
    let count = 0;
    let cumulativeScore = 0;
    let countForAverage = 0;
    let average;
    reportData.forEach((row) => {
      if (row.percentage) {
        count += 1;
        if (notLessonsOrDiagnostic(row.activity_classification_id)) {
          cumulativeScore += parseFloat(row.percentage);
          countForAverage += 1;
        }
      }
    });
    if (countForAverage > 0) {
      average = `${Math.round((cumulativeScore / countForAverage) * 100)}%`;
    }
    return { count, average, };
  };

  calculateTotalTimeSpent = () => {
    const { reportData } = this.state;
    const total = reportData.reduce((previousValue, report) => {
      const { timespent, } = report
      return timespent ? previousValue += timespent : previousValue
    }, 0)
    return getTimeSpent(total);
  }

  grayAndYellowStat(grayContent, yellowContent, optionalClassName, columnWidth) {
    return (
      <td className={optionalClassName} colSpan={columnWidth}>
        <div className="gray-text">{grayContent}</div>
        <div className="yellow-text">{yellowContent}</div>
      </td>
    );
  }

  studentOverviewSection() {
    const { reportData, studentData, classroomName } = this.state;
    let countAndAverage,
      lastActive,
      downloadReportOrLoadingIndicator,
      totalTimeSpent;
    if (reportData) {
      totalTimeSpent = this.calculateTotalTimeSpent();
      countAndAverage = this.calculateCountAndAverage();
      const keysToOmit = [
        'is_a_completed_lesson',
        'completed_at',
        'classroom_activity_id',
        'activity_classification_id',
        'activity_sessions_id'
      ];
      const valuesToChange = [
        {
          key: 'percentage',
          function: (num => `${(num * 100).toString()}%`),
        }
      ];
      const headers = [
        {
          old: 'name',
          new: 'Activity Name',
        }, {
          old: 'unit_name',
          new: 'Activity Pack Name',
        }, {
          old: 'percentage',
          new: 'Score',
        },
        {
          old: 'timespent',
          new: 'Time Spent'
        }
      ];
      const csvReportData = [];
      reportData.forEach((row) => {
        const newRow = _.omit(row, keysToOmit);
        if (notLessonsOrDiagnostic(row.activity_classification_id) && row.percentage) {
          newRow.percentage = `${(newRow.percentage * 100).toString()}%`;
        } else if ((row.activity_classification_id === 6 && row.is_a_completed_lesson) || row.percentage) {
          newRow.percentage = 'Completed';
        } else {
          newRow.percentage = 'Not Completed';
        }
        if(row.timespent){
          newRow.timespent = getTimeSpent(row.timespent);
        }
        headers.forEach((oldNew) => {
          newRow[oldNew.new] = newRow[oldNew.old];
          delete newRow[oldNew.old];
        });
        newRow['Average Score'] = countAndAverage.average;
        csvReportData.push(newRow);
      });
      downloadReportOrLoadingIndicator = <CSVDownloadForProgressReport className="quill-button focus-on-light small primary contained" data={csvReportData} preserveCasing={true} />;
    } else {
      downloadReportOrLoadingIndicator = <LoadingSpinner />;
    }
    if (studentData.last_active) {
      lastActive = moment(studentData.last_active).format('MM/DD/YYYY');
    }
    return (
      <div className="student-overview-header-container">
        <div className="activity-score-student-card-container">
          <div className="student-badge">
            <img alt={singleUserIcon.alt} src={singleUserIcon.src} />
            <p>{studentData.name}</p>
          </div>
          <div className="student-data-container">
            <div className="data-cell">
              <p className="cell-value">{classroomName}</p>
              <p className="cell-label">Class</p>
            </div>
            <div className="data-cell">
              <p className="cell-value">{countAndAverage.average || '--'}</p>
              <p className="cell-label">Overall score</p>
            </div>
            <div className="data-cell">
              <p className="cell-value">{totalTimeSpent || '--'}</p>
              <p className="cell-label">Total time spent</p>
            </div>
            <div className="data-cell">
              <p className="cell-value">{countAndAverage.count || '--'}</p>
              <p className="cell-label">Activities completed</p>
            </div>
            <div className="data-cell">
              <p className="cell-value">{lastActive || '--'}</p>
              <p className="cell-label">Last active</p>
            </div>
          </div>
        </div>
        <div className="csv-and-how-we-grade">
          {downloadReportOrLoadingIndicator}
          <a className="how-we-grade focus-on-light" href="https://support.quill.org/activities-implementation/how-does-grading-work">How we grade</a>
        </div>
      </div>
    );
  }

  render() {
    const { loading, errors, reportData, studentData } = this.state;
    if (errors) {
      return <div className="errors">{errors}</div>;
    }
    if (loading) {
      return <LoadingSpinner />;
    }
    return (
      <div id="student-overview">
        {this.backButton()}
        {this.studentOverviewSection()}
        <StudentOveriewTable
          calculateCountAndAverage={this.calculateCountAndAverage}
          reportData={reportData}
          studentId={studentData.id}
        />
      </div>
    );
  }
}
