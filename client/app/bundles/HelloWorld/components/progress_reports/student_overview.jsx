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
      errors: false
    }
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



	render() {
    let errors
    if (this.state.errors) {
      errors = <div className='errors'>{this.state.errors}</div>
    }
    if (this.state.loading) {
      return <div>LOADING</div>
    }
    return (
    <div>
      {errors}
			<StudentOveriewTable reportData={this.state.reportData}/>
      <CSVLink data={this.state.reportData} target="_blank">Link Report</CSVLink>
    </div>
  	)}

}
