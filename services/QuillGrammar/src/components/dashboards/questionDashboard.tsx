import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import LoadingSpinner from '../shared/loading_spinner'

class QuestionDashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  columns() {
    return [
      {
        Header: 'Student',
        accessor: 'student_name',
        resizable: false,
        Cell: row => row.original.student_name,
      }, {
        Header: 'Teacher',
        accessor: 'teacher_name',
        resizable: false,
        Cell: row => row.original.teacher_name,
      }, {
        Header: 'Classroom',
        accessor: 'classroom_name',
        resizable: false,
        Cell: row => row.original.classroom_name,
      }, {
        Header: 'School',
        accessor: 'school_name',
        resizable: false,
        Cell: row => row.original.school_name,
      }, {
        Header: 'Correct',
        accessor: 'correct',
        resizable: false,
        Cell: row => Number(row.original.correct),
      }, {
        Header: 'Incorrect',
        accessor: 'incorrect',
        resizable: false,
        Cell: row => Number(row.original.incorrect),
      }, {
        Header: 'Success Rate',
        accessor: 'percentage',
        resizable: false,
        Cell: row => `${row.original.percentage}%`,
      }
    ];
  }

  render() {
    if (props.questionRows && props.questionRows.length) {
      return (<div key={`${data.length}-length-for-activities-scores-by-classroom`}>
        <ReactTable
          data={data}
          columns={columns}
          showPagination
          defaultSorted={[{ id: 'last_active', desc: true, }]}
          showPaginationTop={false}
          showPaginationBottom
          showPageSizeOptions={false}
          defaultPageSize={100}
          minRows={1}
          className="progress-report has-green-arrow"
        />
      </div>);
    }
    return <LoadingSpinner />;
  };
}

function select(state: any) {
  return {
    concepts: state.grammarQuestionsAndConceptsMap
  };
}

export default connect(select)(QuestionDashboard);
