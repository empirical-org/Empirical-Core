import React from 'react'

export default class extends React.Component{
  constructor(){
    super()
  }

  classroomRows(){
    return this.props.classrooms.map((classy)=>{
      return(
        <tr key={classy.id}>
          <td>{classy.name}</td>
        </tr>
      )
    })
  }

  classroomsTable(){
    return (<table>
      {this.classroomRows()}
    </table>)
  }
  render(){
    return(
      <div>
        {this.classroomsTable()}
      </div>)
  }
}
