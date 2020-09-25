import * as React from 'react';
import * as Redux from "redux";
import ReactTable from 'react-table';
import { connect } from 'react-redux';

import DashboardFilters from './dashboardFilters'

import LoadingSpinner from '../shared/loading_spinner'
import * as QuestionAndConceptMapActions from '../../actions/questionAndConceptMap'
import { QuestionAndConceptMapReducerState } from '../../reducers/questionAndConceptMapReducer'
import { DashboardConceptRow, DashboardActivity } from '../../interfaces/dashboards'
import Constants from '../../constants'

const { PRODUCTION, BETA, ALPHA, ARCHIVED, NONE, } = Constants

interface ConceptDashboardProps {
  dispatch: Function;
  questionAndConceptMap: QuestionAndConceptMapReducerState;
}

interface ConceptDashboardState {
  allowedActivityFlags: Array<string>;
}

class ConceptDashboard extends React.Component<ConceptDashboardProps, ConceptDashboardState> {
  state = {
    allowedActivityFlags: [PRODUCTION, BETA, ALPHA, ARCHIVED, NONE]
  }

  UNSAFE_componentWillMount() {
    this.props.dispatch(QuestionAndConceptMapActions.checkTimeout())
  }

  updateAllowedActivityFlags = (flags: Array<string>) => {
    this.setState({ allowedActivityFlags: flags, })
  }

  columns() {
    return [
      {
        Header: 'Concept',
        accessor: 'name',
        resizable: false,
        Cell: (row: { original: DashboardConceptRow}) => {
          const { link, name, } = row.original
          return <a href={link}>{name}</a>
        },
      }, {
        Header: 'Explicitly Assigned Activities',
        accessor: 'explicitlyAssignedActivities',
        resizable: false,
        sortMethod: this.sortActivityArray,
        Cell: (row: { original: DashboardConceptRow}) => {
          const explicitlyAssignedActivities = row.original.explicitlyAssignedActivities || []
          return this.filterActivities(explicitlyAssignedActivities).map((act: DashboardActivity) => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
      }, {
        Header: 'Implicitly Assigned Activities',
        accessor: 'implicitlyAssignedActivities',
        resizable: false,
        sortMethod: this.sortActivityArray,
        Cell: (row: { original: DashboardConceptRow}) => {
          const implicitlyAssignedActivities = row.original.implicitlyAssignedActivities || []
          return this.filterActivities(implicitlyAssignedActivities).map((act: DashboardActivity) => <a className="activity-link" href={act.link}>{act.title}</a>)
        },
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

    const firstActivityInArrayA = activityArrayA.map(act => act.title).sort(this.defaultSort)[0]
    const firstActivityInArrayB = activityArrayB.map(act => act.title).sort(this.defaultSort)[0]

    return this.defaultSort(firstActivityInArrayA, firstActivityInArrayB)
  }

  normalizeStringForSorting = (string: string) => {
    if (string) {
      return string.replace(/(<([^>]+)>)/ig, "").replace(/&nbsp;/ig, "").replace(/"|“/g, '').replace(/_+/g, '_').trim();
    } else {
      return ''
    }
  }

  defaultSort = (a: string, b: string) => {
    return this.normalizeStringForSorting(a).localeCompare(this.normalizeStringForSorting(b))
  }

  render() {
    const { questionAndConceptMap, } = this.props
    const { allowedActivityFlags, } = this.state
    if (questionAndConceptMap
      && questionAndConceptMap.data
      && questionAndConceptMap.data.conceptRows
      && questionAndConceptMap.data.conceptRows.length
    ) {
      return (<div className="dashboard-table-container concept-dashboard" key={`${questionAndConceptMap.data.conceptRows.length}-length-for-activities-scores-by-classroom`}>
        <DashboardFilters
          allowedActivityFlags={allowedActivityFlags}
          updateAllowedActivityFlags={this.updateAllowedActivityFlags}
        />
        <ReactTable
          className="concept-dashboard-table"
          columns={this.columns()}
          data={questionAndConceptMap.data.conceptRows}
          defaultPageSize={questionAndConceptMap.data.conceptRows.length}
          defaultSorted={[{ id: 'name', desc: false, }]}
          defaultSortMethod={this.defaultSort}
          minRows={1}
          showPageSizeOptions={false}
          showPagination={false}
        />
      </div>);
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

export default connect(mapStateToProps, mapDispatchToProps)(ConceptDashboard);
