import React from 'react'

export default class extends React.Component{
  constructor(){
    super()
  }

  state = {
    selectedClassroomIds: new Set()
  }

  componentDidMount(){
    this.addAlreadyImportedClassroomsToSelected()
  }

  handleCheckboxClick = (classy) => {
    const newSelectedClassroomIds = Object.assign(this.state.selectedClassroomIds, {})
    newSelectedClassroomIds.has(classy.id) ? newSelectedClassroomIds.delete(classy.id) :  newSelectedClassroomIds.add(classy.id)
    this.setState({ selectedClassroomIds: newSelectedClassroomIds })
  }

  addAlreadyImportedClassroomsToSelected = () => {
    // we get the intitial list of classrooms and check them/keep track of what is already imported
    this.props.classrooms.forEach((classy, index) => {
      if (classy.alreadyImported) {
        const alreadyImportedClasses = Object.assign(this.state.selectedClassroomIds, {})
        this.setState({
          selectedClassroomIds: alreadyImportedClasses.add(classy.id)
        })
      }
    })
  }

  getSelectedClassroomsData = () => {
    const selectedClassrooms = []
    let archivedCount = 0;
    const that = this
    this.props.classrooms.forEach((classy)=>{
      if (that.state.selectedClassroomIds.has(classy.id)) {
        selectedClassrooms.push(classy)
      } else if (classy.alreadyImported) {
        archivedCount ++;
      }
    })
    return({selectedClassrooms, archivedCount})
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
		if (this.state.selectedClassroomIds.has(classy.id)) {
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
    this.props.syncClassrooms(this.getSelectedClassroomsData())
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
