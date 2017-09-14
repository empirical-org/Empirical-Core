import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class UnarchiveUnits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      archivedUnits: [],
      selectedUnitIds: [],
      teacherIdentifier: ''
    }

    this.updateTeacherIdentifier = this.updateTeacherIdentifier.bind(this)
    this.getArchivedUnits = this.getArchivedUnits.bind(this)
    this.toggleSelected = this.toggleSelected.bind(this)
    this.unarchiveUnits = this.unarchiveUnits.bind(this)
  }

  updateTeacherIdentifier(e) {
    this.setState({teacherIdentifier: e.target.value})
  }

  toggleSelected(e) {
    const newSelectedUnitIds = this.state.selectedUnitIds
    const selectedIndex = newSelectedUnitIds.findIndex(unitId => unitId == e.target.value)
    if (selectedIndex === -1) {
      newSelectedUnitIds.push(e.target.value)
    } else {
      newSelectedUnitIds.splice(selectedIndex, 1)
    }
    this.setState({selectedUnitIds: newSelectedUnitIds})
  }

  getArchivedUnits() {
    const that = this
    that.setState({archivedUnits: [], selectedUnitIds: [], error: ''})
    request.get({
      url: `${process.env.DEFAULT_URL}/teacher_fix/get_archived_units`,
      qs: {teacher_identifier: that.state.teacherIdentifier}
    },
    (e, r, response) => {
      const parsedResponse = JSON.parse(response)
      if (parsedResponse.error) {
        that.setState({error: parsedResponse.error})
      } else if (parsedResponse.archived_units)
        that.setState({ archivedUnits: parsedResponse.archived_units, selectedUnitIds: parsedResponse.archived_units.map(u => u.id)});
    });
  }

  unarchiveUnits() {
    const that = this
    request.post({
      url: `${process.env.DEFAULT_URL}/teacher_fix/unarchive_units`,
      json: {unit_ids: that.state.selectedUnitIds, authenticity_token: getAuthToken()}
    },
    (e, r, response) => {
      if (r.statusCode === 200) {
        that.setState({ archivedUnits: {}, selectedUnitIds: {}, teacherIdentifier: ''})
        window.alert('These units have been unarchived.')
      }
    })
  }

  renderTeacherForm() {
    return <div className="input-row">
      <label>Teacher Email Or Username:</label>
      <input type="text" value={this.state.teacherIdentifier} onChange={this.updateTeacherIdentifier}/>
      <button onClick={this.getArchivedUnits}>Submit</button>
    </div>
  }

  renderUnitsForm() {
    if (this.state.archivedUnits.length > 0) {
      const unitsList = this.state.archivedUnits.map(u => {
        const checked = this.state.selectedUnitIds.find(unitId => unitId == u.id)
        return <div  key={u.id}><input type="checkbox" checked={checked} onChange={this.toggleSelected} value={u.id}/>{u.name}</div>
      })
      return <div>
        {unitsList}
        <button onClick={this.unarchiveUnits}>Unarchive Units</button>
      </div>
    }
  }

  renderError() {
    if(this.state.error) {
      return <p className="error">{this.state.error}</p>
    }
  }

  render() {
    return(
      <div>
        <h1><a href="/teacher_fix">Teacher Fixes</a></h1>
        <h2>Unarchive Units</h2>
        <p>All archived units are selected by default. Unarchiving a unit will also unarchive all of that unit's classroom activities and activity sessions.</p>
        {this.renderTeacherForm()}
        {this.renderError()}
        {this.renderUnitsForm()}
      </div>
  )}
}
