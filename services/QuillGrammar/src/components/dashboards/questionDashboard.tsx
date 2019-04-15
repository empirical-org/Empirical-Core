import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import LoadingSpinner from '../shared/loading_spinner'
import * as QuestionAndConceptMapActions from '../../actions/questionAndConceptMap'

class QuestionDashboard extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.dispatch(QuestionAndConceptMapActions.checkTimeout())
  }

  columns() {
    return [
      {
        Header: 'Question',
        accessor: 'prompt',
        resizable: false,
        Cell: row => <a href={row.original.link}>{row.original.prompt}</a>,
      }, {
        Header: 'Concept',
        accessor: 'concept.name',
        resizable: false,
        Cell: row => <a href={row.original.concept.link}>{row.original.concept.name}</a>,
      }, {
        Header: 'Explicitly Assigned Activities',
        accessor: 'explicitlyAssignedActivities',
        resizable: false,
        Cell: row => {
          return row.explicitlyAssignedActivities.map(act => <a href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'Implicitly Assigned Activities',
        accessor: 'implicitlyAssignedActivities',
        resizable: false,
        Cell: row => {
          return row.implicitlyAssignedActivities.map(act => <a href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'No Activities',
        accessor: 'noActivities',
        resizable: false,
        Cell: row => row.original.noActivities,
      }
    ];
  }

  render() {
    if (this.props.questionRows && this.props.questionRows.length) {
      return (<div key={`${this.props.questionRows.length}-length-for-activities-scores-by-classroom`}>
        <ReactTable
          data={this.props.questionRows}
          columns={this.columns()}
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
