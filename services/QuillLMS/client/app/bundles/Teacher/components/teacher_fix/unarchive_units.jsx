import React from 'react'
import request from 'request'
import getAuthToken from '../modules/get_auth_token'

export default class UnarchiveUnits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      archivedUnits: [],
      selectedUnitIds: [],
      changedNames: {},
      teacherIdentifier: ''
    }

    this.updateTeacherIdentifier = this.updateTeacherIdentifier.bind(this)
    this.getArchivedUnits = this.getArchivedUnits.bind(this)
    this.toggleSelected = this.toggleSelected.bind(this)
    this.unarchiveUnits = this.unarchiveUnits.bind(this)
    this.updateName = this.updateName.bind(this)
    this.toggleSelectAllUnits = this.toggleSelectAllUnits.bind(this)
  }

  updateTeacherIdentifier(e) {
    this.setState({teacherIdentifier: e.target.value})
  }

  toggleSelected(e) {
    const newSelectedUnitIds = this.state.selectedUnitIds
    const selectedIndex = newSelectedUnitIds.findIndex(unitId => unitId == e.target.id)
    if (selectedIndex === -1) {
      newSelectedUnitIds.push(e.target.id)
    } else {
      newSelectedUnitIds.splice(selectedIndex, 1)
    }
    this.setState({selectedUnitIds: newSelectedUnitIds})
  }

  updateName(e, id) {
    const newChangedNames = this.state.changedNames
    newChangedNames[id] = e.target.value
    this.setState({changedNames: newChangedNames})
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
      json: {unit_ids: that.state.selectedUnitIds, changed_names: that.state.changedNames, authenticity_token: getAuthToken()}
    },
    (e, r, response) => {
      if (r.statusCode === 200) {
        that.setState({ archivedUnits: [], changedNames: {}, selectedUnitIds: [], teacherIdentifier: ''})
        window.alert('These units have been unarchived.')
      }
    })
  }

  toggleSelectAllUnits() {
    if (this.state.archivedUnits.length === this.state.selectedUnitIds.length) {
      this.setState({selectedUnitIds: []})
    } else {
      this.setState({selectedUnitIds: this.state.archivedUnits.map(u => u.id)})
    }
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
        const nameFieldStyle = u.shared_name ? {'border': 'red 1px solid', 'width': '447px'} : {'width': '447px'}
        return <div key={`${u.id}-${checked}`}>
        <input type="checkbox" onChange={this.toggleSelected} id={u.id} checked={checked}/>
        <input style={nameFieldStyle} onChange={(e) => this.updateName(e, u.id)} value={this.state.changedNames[u.id] || u.name} />
        </div>
      })
      const selectAllCopy = this.state.archivedUnits.length === this.state.selectedUnitIds.length ? 'Unselect All Units' : 'Select All Units'
      return <div>
        <button className="unselect-all-button" onClick={this.toggleSelectAllUnits}>{selectAllCopy}</button>
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
        <p>All archived units are selected by default. Unarchiving a unit will also unarchive all of that unit's classroom units, unit activities, and activity sessions.</p>
        <p>If the input field for a unit name is outlined in red, that means that it shares a name with one of that teacher's visible units. <strong>If you are going to unarchive this unit, make sure you change the name.</strong> Appending a number to the unit's name is a good way to handle this.</p>
        {this.renderTeacherForm()}
        {this.renderError()}
        {this.renderUnitsForm()}
      </div>
  )}
}
