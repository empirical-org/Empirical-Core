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
        Cell: row => <a href={row.original.link}>{row.original.prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "")}</a>,
      }, {
        Header: 'Concept',
        accessor: 'concept.name',
        resizable: false,
        Cell: row => {
          const link = row.original.concept ? row.original.concept.link : ''
          const name = row.original.concept ? row.original.concept.name : ''
          return <a href={link}>{name}</a>
        },
      }, {
        Header: 'Explicitly Assigned Activities',
        accessor: 'explicitlyAssignedActivities',
        resizable: false,
        Cell: row => {
          const explicitlyAssignedActivities = row.explicitlyAssignedActivities || []
          return explicitlyAssignedActivities.map(act => <a href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'Implicitly Assigned Activities',
        accessor: 'implicitlyAssignedActivities',
        resizable: false,
        Cell: row => {
          const implicitlyAssignedActivities = row.implicitlyAssignedActivities || []
          return implicitlyAssignedActivities.map(act => <a href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'No Activities',
        accessor: 'noActivities',
        resizable: false,
        Cell: row => row.original.noActivities,
      }
    ];
  }

  defaultSort(a, b) {
    return a.replace('"', '').localeCompare(b.replace('"', ''))
  }

  render() {
    const { questionAndConceptMap, } = this.props
    if (questionAndConceptMap
      && questionAndConceptMap.data
      && questionAndConceptMap.data.questionRows
      && questionAndConceptMap.data.questionRows.length
    ) {
      return (<div className="dashboard-table-container" key={`${questionAndConceptMap.data.questionRows.length}-length-for-activities-scores-by-classroom`}>
        <ReactTable
          data={questionAndConceptMap.data.questionRows}
          columns={this.columns()}
          showPagination={false}
          defaultSorted={[{ id: 'prompt', desc: false, }]}
          defaultSortMethod={this.defaultSort}
          showPageSizeOptions={false}
          defaultPageSize={questionAndConceptMap.data.questionRows.length}
          minRows={1}
          className="question-dashboard-table"
        />
      </div>);
    }
    return <LoadingSpinner />;
  };
}

function select(state: any) {
  return {
    questionAndConceptMap: state.questionAndConceptMap
  };
}

export default connect(select)(QuestionDashboard);
