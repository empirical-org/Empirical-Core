import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'
import getParameterByName from '../modules/get_parameter_by_name'
import StudentOveriewTable from './student_overview_table.jsx'

export default class extends React.Component {

	constructor(){
		super()
    this.state = {
      loading: true,
      errors: false,
			validActivityCount: 0,
			cumulativeScore: 0,
			averageScore: null
    }
		this.calculateCountAndAverage = this.calculateCountAndAverage.bind(this)
	}

  componentDidMount(){
    const that = this;
		const classroomId = getParameterByName('classroom_id', window.location.href)
		const studentId = getParameterByName('student_id', window.location.href)
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/student_overview_data/${studentId}/${classroomId}`,
    },
    (e, r, body) => {
      const data = JSON.parse(body)
      that.setState({loading: false, errors: body.errors, studentData: data.student_data, reportData: data.report_data});
    });
  }

	csvButton(){
		return <td><button>CSV</button></td>
	}

	grayAndYellowStat(grayContent,yellowContent){
		return (<td>
			<div className='gray-text'>{grayContent}</div>
			<div className='yellow-text'>{yellowContent}</div>
		</td>)
	}

	calculateCountAndAverage(unitCumulativeScore, unitValidActivityCount){
		// const validActivityCount = this.state.validActivityCount + unitValidActivityCount;
		// const cumulativeScore = this.state.cumulativeScore + unitCumulativeScore
		// this.setState({validActivityCount, cumulativeScore, averageScore: cumulativeScore/validActivityCount})
	}

	studentOverviewSection(){
		return (
		 <table className='overview-header-table'>
			 <tbody>
				 <tr>
					 <td className='student-name'>
						 {this.state.studentData.name}
					 </td>
					 {this.grayAndYellowStat('Class', this.state.classroomName)}
					 {this.csvButton()}
				 </tr>
				 <tr className='bottom'>
					 {this.grayAndYellowStat('Overall Score:', this.state.averageScore || '--')}
					 {this.grayAndYellowStat('Activities Completed:', this.state.validActivityCount)}
					 {this.grayAndYellowStat('I DON"T KNOW WHAT THIS THING IS!', this.state.averageScore || '--')}
				 </tr>
			 </tbody>
		</table>)
	}



	render() {
    let errors
    if (this.state.errors) {
      errors = <div className='errors'>{this.state.errors}</div>
    }
    if (this.state.loading) {
      return <div>LOADING</div>
    }
    return (
    <div id='student-overview'>
      {errors}
			{this.studentOverviewSection()}
			<StudentOveriewTable reportData={this.state.reportData} studentId={this.state.studentData.id} calculateCountAndAverage={this.calculateCountAndAverage}/>
      <CSVLink data={this.state.reportData} target="_blank">Link Report</CSVLink>
    </div>
  	)}

}
