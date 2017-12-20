// The progress report showing all students in a given classroom
// along with their result counts.
import React from 'react'
import request from 'request'
import CSVDownloadForProgressReport from './csv_download_for_progress_report.jsx'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import {sortByLastName} from '../../../../modules/sortingMethods.js'
import LoadingSpinner from '../shared/loading_indicator.jsx'


export default class extends React.Component {

	constructor(props){
		super()
    this.state = {
      loading: true,
      errors: false,
    }
	}

  componentDidMount(){
    const that = this;
    request.get({
      url: `${process.env.DEFAULT_URL}/${this.props.sourceUrl}`,
    },
    (e, r, body) => {
      const data = JSON.parse(body)
      that.setState({loading: false, errors: body.errors, reportData: data.students});
    });
  }

  columns() {
    return ([
      {
        Header: 'Student',
        accessor: 'name',
        resizable: false,
        sortMethod: sortByLastName,
        Cell: row => (<a href={row.original['concepts_href']}>{row.original['name']}</a>)
      }, {
        Header: 'Questions',
        accessor: 'total_result_count',
        resizable: false
      }, {
        Header: 'Correct',
        accessor: 'correct_result_count',
        resizable: false
      }, {
        Header: 'Incorrect',
        accessor: 'incorrect_result_count',
        resizable: false
      }, {
        Header: 'Percentage',
        accessor: 'percentage',
        resizable: false
      }, {
        Header: "",
        accessor: 'green_arrow',
        resizable: false,
        sortable: false,
        className: 'hi',
        width: 80,
        Cell: props => props.value
      }
    ])
  }

  render(){
    if (this.state.loading || !this.state.reportData) {
      return <LoadingSpinner/>
    }
    return (<div>
      <div>state:{JSON.stringify(this.state)}</div>
      <div>props:{JSON.stringify(this.props)}</div>
        <ReactTable data={this.state.reportData}
          columns={this.columns()}
          showPagination={false}
          defaultSorted={[{id: 'last_active', desc: true}]}
          showPaginationTop={false}
          showPaginationBottom={false}
          showPageSizeOptions={false}
          defaultPageSize={this.state.reportData.length}
          className='progress-report has-green-arrow'/>
    </div>)
  }

};

  // getInitialState: function() {
  //   return {
  //     students: {}
  //   }
  // },
  //
  // columnDefinitions: function() {
  //   return [
  //     {
  //       name: 'Name',
  //       field: 'name',
  //       sortByField: 'name',
  //       customCell: function(row) {
  //         return (
  //           <a className="concepts-view" href={row['concepts_href']}>{row['name']}</a>
  //         );
  //       }
  //     },
  //     {
  //       name: 'Questions',
  //       field: 'total_result_count',
  //       sortByField: 'total_result_count'
  //     },
  //     {
  //       name: 'Correct',
  //       field: 'correct_result_count',
  //       sortByField: 'correct_result_count'
  //     },
  //     {
  //       name: 'Incorrect',
  //       field: 'incorrect_result_count',
  //       sortByField: 'incorrect_result_count'
  //     },
  //     {
  //       name: 'Percentage',
  //       field: 'percentage',
  //       sortByField: 'percentage',
  //       customCell: function(row) {
  //         return row['percentage'] + '%';
  //       }
  //     }
  //   ];
  // },
  //
  // sortDefinitions: function() {
  //   return {
  //     config: {
  //       name: 'lastName',
  //       total_result_count: 'numeric',
  //       correct_result_count: 'numeric',
  //       incorrect_result_count: 'numeric',
  //       percentage: 'numeric'
  //     },
  //     default: {
  //       field: 'name',
  //       direction: 'asc'
  //     }
  //   };
  // },
  //
  // onFetchSuccess: function(responseData) {
  //   this.setState({
  //     students: responseData.students
  //   });
  // },
  //
  // render: function() {
  //   return (
  //     <ProgressReport columnDefinitions={this.columnDefinitions}
  //                        pagination={false}
  //                        sourceUrl={this.props.sourceUrl}
  //                        sortDefinitions={this.sortDefinitions}
  //                        jsonResultsKey={'students'}
  //                        onFetchSuccess={this.onFetchSuccess}
  //                        filterTypes={[]}
  //                        premiumStatus={this.props.premiumStatus}
  //                        >
  //       <h2>Results by Student</h2>
  //       <br></br>
  //     </ProgressReport>
  //   );
  // }
