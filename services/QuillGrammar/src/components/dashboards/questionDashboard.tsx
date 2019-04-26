import * as React from 'react';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import DashboardFilters from './dashboardFilters'
import LoadingSpinner from '../shared/loading_spinner'
import * as QuestionAndConceptMapActions from '../../actions/questionAndConceptMap'
import Constants from '../../constants'

const { PRODUCTION, BETA, ALPHA, ARCHIVED, NONE, } = Constants

class QuestionDashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      allowedActivityFlags: [PRODUCTION, BETA, ALPHA, ARCHIVED, NONE],
      allowedQuestionFlags: [PRODUCTION, BETA, ALPHA, ARCHIVED, NONE]
    }

    this.defaultSort = this.defaultSort.bind(this)
    this.normalizeStringForSorting = this.normalizeStringForSorting.bind(this)
    this.updateAllowedActivityFlags = this.updateAllowedActivityFlags.bind(this)
    this.updateAllowedQuestionFlags = this.updateAllowedQuestionFlags.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(QuestionAndConceptMapActions.checkTimeout())
  }

  updateAllowedActivityFlags(flags: Array<string>) {
    this.setState({ allowedActivityFlags: flags, })
  }

  updateAllowedQuestionFlags(flags: Array<string>) {
    this.setState({ allowedQuestionFlags: flags, })
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
          return this.filterActivities(explicitlyAssignedActivities).map(act => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'Implicitly Assigned Activities',
        accessor: 'implicitlyAssignedActivities',
        resizable: false,
        sortMethod: this.sortActivityArray,
        Cell: row => {
          const implicitlyAssignedActivities = row.original.implicitlyAssignedActivities || []
          return this.filterActivities(implicitlyAssignedActivities).map(act => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'No Activities',
        accessor: 'noActivities',
        resizable: false,
        sortMethod: (a, b) => a ? 1 : -1,
        Cell: row => <span>{String(row.original.noActivities)}</span>,
      }
    ];
  }

  filterActivities(activities) {
    return activities.filter(act => {
      return (this.state.allowedActivityFlags.includes(act.flag)
      || (!act.flag && this.state.allowedActivityFlags.includes(NONE)))
    })
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
    const { allowedQuestionFlags, allowedActivityFlags, } = this.state
    if (questionAndConceptMap
      && questionAndConceptMap.data
      && questionAndConceptMap.data.questionRows
      && questionAndConceptMap.data.questionRows.length
    ) {
      const filteredData = questionAndConceptMap.data.questionRows.filter(q => {
        return (allowedQuestionFlags.includes(q.flag)
        || (!q.flag && allowedQuestionFlags.includes(NONE)))
      })
      return (<div className="dashboard-table-container" key={`${filteredData.length}-length-for-activities-scores-by-classroom`}>
        <DashboardFilters
          allowedQuestionFlags={allowedQuestionFlags}
          allowedActivityFlags={allowedActivityFlags}
          updateAllowedActivityFlags={this.updateAllowedActivityFlags}
          updateAllowedQuestionFlags={this.updateAllowedQuestionFlags}
        />
        <ReactTable
          data={filteredData}
          columns={this.columns()}
          showPagination={false}
          defaultSorted={[{ id: 'prompt', desc: false, }]}
          defaultSortMethod={this.defaultSort}
          showPageSizeOptions={false}
          defaultPageSize={filteredData.length}
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
