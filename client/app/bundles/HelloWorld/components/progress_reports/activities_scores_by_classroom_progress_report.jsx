import React from 'react'
import request from 'request'

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
      const data = JSON.parse(body)
      that.setState({loading: false, errors: body.errors, classroomsData: body.classrooms_data});
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
      'HOLA!'
    </div>
  	)}

}
