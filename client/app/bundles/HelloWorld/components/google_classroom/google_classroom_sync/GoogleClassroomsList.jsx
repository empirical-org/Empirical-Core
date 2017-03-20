import React from 'react'

export default class extends React.Component{
  constructor(){
    super()
  }

  state = {
    selectedClassroomIds: new Set()
  }

  handleCheckboxClick = (e) => {
    const newSelectedClassroomIds = Object.assign(this.state.selectedClassroomIds, {})
    e.currentTarget.checked ? newSelectedClassroomIds.add(e.target.id) : newSelectedClassroomIds.delete(e.target.id)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds }, console.log(this.state.selectedClassroomIds))
  }

  syncClassrooms = () => {
    const that = this
    const selectedClassrooms = JSON.stringify(this.getSelectedClassroomsData())
    $.ajax({
      type: 'post',
      data: {selected_classrooms: selectedClassrooms},
      url: '/teachers/classrooms/update_google_classrooms',
      statusCode: {
        200: function() {
          that.syncClassroomSuccess()
          }
      }
    })
  }

  syncClassroomSuccess = () => {
    $.ajax({
      type: 'get',
      url: '/teachers/classrooms/import_google_students'
    })
    console.log('we did it! now importing students')
  }

  getSelectedClassroomsData = () => {
    const selectedClassrooms = []
    const that = this;
    this.state.selectedClassroomIds.forEach((id) => {
      selectedClassrooms.push(that.props.classrooms.find((classy) => classy.id == id))
    })
    return selectedClassrooms
  }

  classroomRows(){
    return this.props.classrooms.map((classy)=>{
      return(
        <tr key={classy.id}>
          <td><input type="checkbox" id={classy.id} onClick={this.handleCheckboxClick}/></td>
          <td>{classy.name}</td>
        </tr>
      )
    })
  }

  classroomsTable(){
    return (<table>
      <tbody>
      {this.classroomRows()}
      </tbody>
    </table>)
  }
  render(){
    return(
      <div>
        {this.classroomsTable()}
        <button onClick={this.syncClassrooms}>Sync Classrooms</button>
      </div>)
  }
}
