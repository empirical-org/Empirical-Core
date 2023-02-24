import React from 'react';
import moment from 'moment';
import _ from 'underscore';
import l from 'lodash';

import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx';
import StudentOveriewTable from './student_overview_table.jsx';

import getParameterByName from '../modules/get_parameter_by_name';
import LoadingSpinner from '../shared/loading_indicator.jsx';
import { getTimeSpent } from '../../helpers/studentReports';
import notLessonsOrDiagnostic from '../../../../modules/activity_classifications.js';
import { requestGet, } from '../../../../modules/request/index'

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
      `${import.meta.env.VITE_DEFAULT_URL}/api/v1/progress_reports/student_overview_data/${studentId}/${classroomId}`,
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
      downloadReportOrLoadingIndicator = <CSVDownloadForProgressReport data={csvReportData} preserveCasing={true} />;
    } else {
      downloadReportOrLoadingIndicator = <LoadingSpinner />;
    }
    if (studentData.last_active) {
      lastActive = moment(studentData.last_active).format('MM/DD/YYYY');
    }
    return (
      <table className="overview-header-table">
        <tbody>
          <tr className="top">
            <td className="student-name" colSpan="6">
              {studentData.name}
            </td>
            <td className="csv-link" colSpan="1">
              {downloadReportOrLoadingIndicator}
            </td>
          </tr>
          <tr className="bottom">
            {this.grayAndYellowStat('Class', classroomName, "class-column", "1")}
            {this.grayAndYellowStat('Overall score', countAndAverage.average || '--', "", "2")}
            {this.grayAndYellowStat('Total time spent', totalTimeSpent || '--', "", "1")}
            {this.grayAndYellowStat('Activities completed', countAndAverage.count || '--', "", "2")}
            {this.grayAndYellowStat('Last active', lastActive || '--', 'last-active', "1")}
          </tr>
        </tbody>
      </table>
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
