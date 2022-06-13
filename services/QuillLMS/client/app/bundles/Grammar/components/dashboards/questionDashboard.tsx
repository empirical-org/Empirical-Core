import * as React from 'react';
import * as Redux from "redux";

import { connect } from 'react-redux';
import DashboardFilters from './dashboardFilters'
import LoadingSpinner from '../shared/loading_spinner'
import * as QuestionAndConceptMapActions from '../../actions/questionAndConceptMap'
import { QuestionAndConceptMapReducerState } from '../../reducers/questionAndConceptMapReducer'
import { DashboardActivity } from '../../interfaces/dashboards'
import Constants from '../../constants'
import { ReactTable, } from '../../../Shared/index'

const { PRODUCTION, GAMMA, BETA, ALPHA, ARCHIVED, NONE, } = Constants

interface QuestionDashboardProps {
  dispatch: Function;
  questionAndConceptMap: QuestionAndConceptMapReducerState;
}

interface QuestionDashboardState {
  allowedActivityFlags: Array<string>;
  allowedQuestionFlags: Array<string>
}

class QuestionDashboard extends React.Component<QuestionDashboardProps, QuestionDashboardState> {
  state = {
    allowedActivityFlags: [PRODUCTION, GAMMA, BETA, ALPHA, ARCHIVED, NONE],
    allowedQuestionFlags: [PRODUCTION, GAMMA, BETA, ALPHA, ARCHIVED, NONE]
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch(QuestionAndConceptMapActions.checkTimeout())
  }

  updateAllowedActivityFlags = (flags: Array<string>) => {
    this.setState({ allowedActivityFlags: flags, })
  }

  updateAllowedQuestionFlags = (flags: Array<string>) => {
    this.setState({ allowedQuestionFlags: flags, })
  }

  columns() {
    return [
      {
        Header: 'Question',
        accessor: 'prompt',
        resizable: false,
        sortType: this.defaultSort,
        Cell: ({row}) => {
          const prompt = row.original.prompt
          const formattedPrompt = prompt ? prompt.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "").replace(/&quot;/ig, '"').replace(/&#x27;/ig, "'") : 'No prompt'
          return <a href={row.original.link}>{formattedPrompt}</a>
        },
      }, {
        Header: 'Concept',
        accessor: 'concept.name',
        resizable: false,
        sortType: this.defaultSort,
        Cell: ({row}) => {
          const link = row.original.concept ? row.original.concept.link : ''
          const name = row.original.concept ? row.original.concept.name : ''
          return <a href={link}>{name}</a>
        },
      }, {
        Header: 'Explicitly Assigned Activities',
        accessor: 'explicitlyAssignedActivities',
        resizable: false,
        sortType: this.sortActivityArray,
        Cell: ({row}) => {
          const explicitlyAssignedActivities = row.original.explicitlyAssignedActivities || []
          return this.filterActivities(explicitlyAssignedActivities).map((act: DashboardActivity) => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'Implicitly Assigned Activities',
        accessor: 'implicitlyAssignedActivities',
        resizable: false,
        sortType: this.sortActivityArray,
        Cell: ({row}) => {
          const implicitlyAssignedActivities = row.original.implicitlyAssignedActivities || []
          return this.filterActivities(implicitlyAssignedActivities).map((act: DashboardActivity) => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'No Activities',
        accessor: 'noActivities',
        resizable: false,
        sortType: this.defaultSort,
        Cell: ({row}) => <span>{String(row.original.noActivities)}</span>,
      }
    ];
  }

  filterActivities(activities: Array<DashboardActivity>) {
    return activities.filter((act: DashboardActivity) => {
      return (this.state.allowedActivityFlags.includes(act.flag)
      || (!act.flag && this.state.allowedActivityFlags.includes(NONE)))
    })
  }

  sortActivityArray = (activityArrayA: Array<DashboardActivity>, activityArrayB: Array<DashboardActivity>) => {
    if (!(activityArrayB && activityArrayB.length)) { return 1 }
    if (!(activityArrayA && activityArrayA.length)) { return -1 }

    const firstActivityInArrayA = activityArrayA.map(act => act.title).sort(this.stringSort)[0]
    const firstActivityInArrayB = activityArrayB.map(act => act.title).sort(this.stringSort)[0]

    return this.stringSort(firstActivityInArrayA, firstActivityInArrayB)
  }

  normalizeStringForSorting = (string: string) => {
    if (string) {
      return string.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "").replace(/"|“/g, '').replace(/_+/g, '_').trim();
    } else {
      return ''
    }
  }

  defaultSort = (row1, row2, key) => {
    return this.stringSort(row1.original[key], row2.original[key])
  }

  stringSort(string1, string2) { return this.normalizeStringForSorting(string1).localeCompare(this.normalizeStringForSorting(string2)) }

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
      return (
        <div className="dashboard-table-container question-dashboard" key={`${filteredData.length}-length-for-activities-scores-by-classroom`}>
          <DashboardFilters
            allowedActivityFlags={allowedActivityFlags}
            allowedQuestionFlags={allowedQuestionFlags}
            updateAllowedActivityFlags={this.updateAllowedActivityFlags}
            updateAllowedQuestionFlags={this.updateAllowedQuestionFlags}
          />
          <ReactTable
            className="question-dashboard-table"
            columns={this.columns()}
            data={filteredData}
            defaultSorted={[{ id: 'prompt', desc: false, }]}
          />
        </div>
      );
    }
    return <LoadingSpinner />;
  };
}

const mapStateToProps = (state: any) => {
  return {
    questionAndConceptMap: state.questionAndConceptMap
  };
};

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
  return {
    dispatch
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDashboard);
