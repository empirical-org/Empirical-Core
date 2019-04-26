import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import LoadingSpinner from '../shared/loading_spinner'
import * as QuestionAndConceptMapActions from '../../actions/questionAndConceptMap'

class QuestionDashboard extends React.Component {
  constructor(props) {
    super(props)

    this.defaultSort = this.defaultSort.bind(this)
    this.normalizeStringForSorting = this.normalizeStringForSorting.bind(this)
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
        sortMethod: this.sortActivityArray,
        Cell: row => {
          const explicitlyAssignedActivities = row.original.explicitlyAssignedActivities || []
          return explicitlyAssignedActivities.map(act => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'Implicitly Assigned Activities',
        accessor: 'implicitlyAssignedActivities',
        resizable: false,
        sortMethod: this.sortActivityArray,
        Cell: row => {
          const implicitlyAssignedActivities = row.original.implicitlyAssignedActivities || []
          return implicitlyAssignedActivities.map(act => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'No Activities',
        accessor: 'noActivities',
        resizable: false,
        Cell: row => row.original.noActivities,
      }
    ];
  }

  sortActivityArray(a, b) {
    if (a && a.length && b && b.length) {
      const sortedA = a.sort(act => act.title)
      const sortedB = b.sort(act => act.title)
      if (sortedA[0].title > sortedB[0].title) {
        return -1
      } else if (sortedA[0].title < sortedB[0].title) {
        return 1
      } else {
        return 0
      }
    } else if (a && a.length) {
      return 1
    } else if (b && b.length) {
      return -1
    } else {
      return 0
    }
  }

  normalizeStringForSorting(string) {
    if (string) {
      return string.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "").replace(/"|“/g, '').replace(/_+/g, '_').trim()
    } else {
      return ''
    }
  }

  defaultSort(a, b) {
    return this.normalizeStringForSorting(a).localeCompare(this.normalizeStringForSorting(b))
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
