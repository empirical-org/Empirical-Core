import React from 'react'

export default class extends React.Component{
  constructor(){
    super()
  }

  state = {
    selectedClassroomIds: new Set(),
    alreadyImportedClasses: new Set()
  }

  componentDidMount(){
    this.addAlreadyImportedClassroomsToState()
  }

  handleCheckboxClick = (classy) => {
    const newSelectedClassroomIds = Object.assign(this.state.selectedClassroomIds, {})
    const idString = classy.id.toString();
    newSelectedClassroomIds.has(idString) ? newSelectedClassroomIds.delete(idString) :  newSelectedClassroomIds.add(idString)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds })
  }

  addAlreadyImportedClassroomsToState = () => {
    // we get the intitial list of classrooms and check them/keep track of what is already imported
    this.props.classrooms.forEach((classy, index) => {
      if (classy.alreadyImported) {
        const alreadyImportedClasses = Object.assign(this.state.selectedClassroomIds, {})
        this.setState({
          selectedClassroomIds: alreadyImportedClasses.add(classy.id.toString())
        })
      }
    })
  }

  getSelectedClassroomsData = () => {
    const selectedClassrooms = []
    let archivedCount = 0;
    // this.state.selectedClassroomIds.forEach((id) => {
    //   selectedClassrooms.push(that.props.classrooms.find((classy) => classy.id == id))
    // })
    const that = this
    this.props.classrooms.forEach((classy)=>{
      if (that.state.selectedClassroomIds.has(classy.id.toString())) {
        selectedClassrooms.push(classy)
      } else if (classy.alreadyImported) {
        archivedCount ++;
      }
    })
    console.log({selectedClassrooms, archivedCount})
  }

  orderGoogleClassrooms = () => {
    return this.props.classrooms.sort((a, b) => {
      // sorts by if alreadyImported, then by creationTime
      if (a.alreadyImported === b.alreadyImported) {
        return a.creationTime-b.creationTime;
      } else if (a.alreadyImported) {
        return -1;
      } else {
        return 1;
      }
    })
  }

  renderSelectedCheck = (classy) => {
		if (this.state.selectedClassroomIds.has(classy.id.toString())) {
			return (
				<img className="recommendation-check" src="/images/recommendation_check.svg"></img>
			)
		}
	}

  connected = (alreadyImported) => {
    if (alreadyImported) {
      return <span className='connected'>Connected</span>
    }
  }

  classroomRows(){
    let that = this;
    return this.orderGoogleClassrooms().map((classy)=>{
      return(
        <tr key={classy.id}>
          <td>
            <div className="donalito-checkbox" onClick={that.handleCheckboxClick.bind(null, classy)}>
  						{that.renderSelectedCheck(classy)}
  					</div>
          </td>
          <td>{classy.name}</td>
          <td>{classy.section || 'section #'}</td>
          <td>{this.connected(classy.alreadyImported)}</td>
          <td>{classy.creationTime}</td>
        </tr>
      )
    })
  }

  syncClassrooms(){
    this.props.syncClassrooms(this.getSelectedClassroomsData(), this.state.alreadyImportedClasses)
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
        <button onClick={() => this.syncClassrooms()}>Sync Classrooms</button>
      </div>)
  }
}
