import React from 'react'
import ItemDropdown from '../components/general_components/dropdown_selectors/item_dropdown.jsx'
import LoadingIndicator from '../components/shared/loading_indicator'
import request from 'request';

export default class extends React.Component {

	constructor(){
		super()
    this.state = {loading: true}
    this.switchClassrooms = this.switchClassrooms.bind(this);

	}

  componentDidMount(){
    let that = this
    request.get({
      url: `${process.env.DEFAULT_URL}/teachers/classrooms/classrooms_i_teach`,
    },
    (e, r, data) => {
      that.setState({
        loading: false,
        classrooms: JSON.parse(data).classrooms.map(c=>{return {id: c.id, name: c.name}})
      })
    });
  }

  switchClassrooms(classroom){
    window.location = `${process.env.DEFAULT_URL}/teachers/classrooms/${classroom.id}/students`
  }


	render() {
    if (this.state.loading) {
      return <LoadingIndicator/>
    } else {
      return (
        <ItemDropdown
            items={this.state.classrooms}
            callback={this.switchClassrooms}
            selectedItem={this.state.classrooms.find(c => c.id === this.props.classroomId)}
        />)
    }
  }
}
