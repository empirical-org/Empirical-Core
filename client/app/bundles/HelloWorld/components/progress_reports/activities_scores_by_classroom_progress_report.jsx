import React from 'react'
import request from 'request'
import {CSVDownload, CSVLink} from 'react-csv'

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
    request.get({
      url: `${process.env.DEFAULT_URL}/api/v1/progress_reports/activities_scores_by_classroom_data`,
    },
    (e, r, body) => {
      const data = JSON.parse(body).data
      const csvData = this.formatDataForCSV(data)
      that.setState({loading: false, errors: body.errors, classroomsData: data, csvData});
    });
  }

  formatDataForCSV(data){
    const csvData = [['Classroom Name', 'Student Name', 'Average Score', 'Activity Count']]
    data.forEach((row)=>{
      csvData.push([row['classroom_name'], row['name'], row['average_score']*100, row['activity_count']])
    })
    return csvData
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
      'HOLA!'
      <CSVLink data={this.state.csvData} target="_blank">Link Report</CSVLink>
    </div>
  	)}

}
