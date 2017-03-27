import React from 'react'
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import NumberSuffix from '../../modules/numberSuffixBuilder.js'
import LoadingIndicator from '../../shared/loading_indicator.jsx'
import Pluralize from 'pluralize'

export default class extends React.Component{
  constructor(){
    super()
    this.handleSelect = this.handleSelect.bind(this)
    this.handleExpansionRowClick = this.handleExpansionRowClick.bind(this)
  }

  state = {showAllRows: false}

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
    // e looks like {id: 232322, grade: 3}
    const newClassrooms = this.state.classrooms.slice(0);
    const classy = newClassrooms.find((c)=>c.id === e.id)
    const classyIndex = newClassrooms.indexOf(classy);
    const newClassy = Object.assign({}, classy);
    newClassy.grade = e.grade
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
    // returns an array of checked classrooms, along with an count
    // of how many were archived for us to warn the user
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
    // sorts by if alreadyImported, then by creationTime
    return this.state.classrooms.sort((a, b) => {
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
    // this is the title of the dropdown menu
    if (grade) {
      return grade == 'University' ? grade : `${NumberSuffix(grade)} Grade`
    } else {
      return 'Select Grade'
    }
  }

  handleExpansionRowClick(){
    this.setState({showAllRows: true}, console.log(this.state))
  }

  classroomRows(){
    const defaultRowLength = 2;
    const tableRows = [];
    const orderedClassrooms = this.orderGoogleClassrooms();
    const maxNumber = this.state.showAllRows ?  orderedClassrooms.length : Math.min(orderedClassrooms.length, defaultRowLength)
    console.log(maxNumber);
    for (let i = 0; i < maxNumber; i++) {
      tableRows.push(this.rowConstructor(orderedClassrooms[i]))
    }
    const extraRows = orderedClassrooms.length - defaultRowLength
    if (!this.state.showAllRows && extraRows > 0) {
      tableRows.push(this.expansionRow(extraRows))
    }
    return tableRows
  }

  expansionRow(extraRows) {
    return(
      <tr className='expansion' key='expansion' onClick={this.handleExpansionRowClick}>
        <td colSpan={100}>You have {extraRows} more {Pluralize('class', extraRows)} (<span>Show Classrooms</span>)</td>
      </tr>
    )
  }

  rowConstructor = (classy) => {
    return(
      <tr key={classy.id}>
        <td>
          <div className="donalito-checkbox" onClick={this.handleCheckboxClick.bind(null, classy)}>
            {this.renderSelectedCheck(classy)}
          </div>
        </td>
        <td>{classy.name}</td>
        <td>{classy.section || ''}</td>
        <td>{this.connected(classy.alreadyImported)}</td>
        <td>
          <DropdownButton
            id={`grade-dropdown-${classy.id}`}
            disabled={!classy.checked}
            className={`select-grade ${classy.grade ? 'has-grade' : null}`}
            title={this.formatTitle(classy.grade)}
            onSelect={this.handleSelect}>
              {this.grades(classy.id)}
          </DropdownButton>
        </td>
      </tr>
    )
  }

  grades(id) {
    // populates dropdown menu with grades
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
    return (<table key={this.state.showAll}>
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
