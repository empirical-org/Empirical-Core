import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NumberSuffix from '../../modules/numberSuffixBuilder.js'
import LoadingIndicator from '../../shared/loading_indicator.jsx'

export default class extends React.Component{
  constructor(){
    super()
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount(){
    this.checkImportedClassroomsAndMoveAllToState()
  }

  handleCheckboxClick = (classy) => {
    const newClassy = Object.assign(classy);
    const newClassrooms = this.state.classrooms.slice(0);
    const classyIndex = newClassrooms.indexOf(classy)
    newClassy.checked = newClassy.checked ? false : true;
    newClassrooms[classyIndex] = newClassy;
    this.setState({classrooms: newClassrooms})
  }


  handleSelect(e) {
    const newClassrooms = this.state.classrooms.slice(0);
    const classy = newClassrooms.find((c)=>c.id === e.id)
    const classyIndex = newClassrooms.indexOf(classy);
    const newClassy = Object.assign({grade: e.grade}, classy);
    newClassrooms[classyIndex] = newClassy;
    this.setState({classrooms: newClassrooms})
  }

  checkImportedClassroomsAndMoveAllToState = () => {
    // we get the intitial list of classrooms and check them/keep track of what is already imported
    const classrooms = [];
    this.props.classrooms.forEach((classy, index) => {
      if (classy.alreadyImported) {
        classy.checked = true;
      }
      classrooms.push(classy)
    })
    this.setState({classrooms})
  }

  getSelectedClassroomsData = () => {
    const selectedClassrooms = []
    let archivedCount = 0;
    const that = this
    this.state.classrooms.forEach((classy)=>{
      if (classy.checked) {
        selectedClassrooms.push(classy)
      } else if (classy.alreadyImported) {
        archivedCount ++;
      }
    })
    return({selectedClassrooms, archivedCount})
  }

  orderGoogleClassrooms = () => {
    return this.state.classrooms.sort((a, b) => {
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
		if (classy.checked) {
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

  formatTitle(grade){
    if (grade) {
      debugger;
      return grade == 'University' ? grade : NumberSuffix(grade)
    } else {
      return 'Grade'
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
          <td>{that.connected(classy.alreadyImported)}</td>
          <td>
            <DropdownButton
              id={`grade-dropdown-${classy.id}`}
              disabled={!classy.checked}
              className={classy.grade ? 'has-grade' : null}
              bsStyle='default'
              title={this.formatTitle(classy.grade)}
              onSelect={this.handleSelect}>
                {that.grades(classy.id)}
            </DropdownButton>
          </td>
        </tr>
      )
    })
  }

  grades(id) {
      let grades = [];
      for (let grade = 1; grade <= 12; grade++) {
          grades.push(
              <MenuItem id={`${grade}-${id}`} key={`${grade}-${id}`} eventKey={{id, grade: grade}}>{NumberSuffix(grade)}</MenuItem>
          )
      }
      grades.push(<MenuItem id={`university-${id}`} key={`university-${id}`} eventKey={'University'}>University</MenuItem>)
      return grades
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

  classroomsOrLoading(){
    if (this.state && this.state.classrooms) {
      return this.classroomsTable()
    } else {
      return <LoadingIndicator/>
    }
  }

  render(){
    return(
      <div>
        {this.classroomsOrLoading()}
        <button onClick={() => this.syncClassrooms()}>Sync Classrooms</button>
      </div>)
  }
}
