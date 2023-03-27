import React from 'react';

import { requestGet, requestPost } from '../../../../modules/request/index';

export default class UnarchiveUnits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      archivedUnits: [],
      selectedUnitIds: [],
      changedNames: {},
      teacherIdentifier: ''
    }
  }

  getArchivedUnits = () => {
    const that = this
    that.setState({archivedUnits: [], selectedUnitIds: [], error: ''})
    requestGet(
      `${import.meta.env.VITE_DEFAULT_URL}/teacher_fix/archived_units?teacher_identifier=${that.state.teacherIdentifier}`,
      (body) => {
        if (body.archived_units) {
          that.setState({ archivedUnits: body.archived_units, selectedUnitIds: body.archived_units.map(u => u.id)});
        }
      },
      (body) => {
        if (body.error) {
          that.setState({error: body.error})
        }
      }
    )
  };

  toggleSelectAllUnits = () => {
    if (this.state.archivedUnits.length === this.state.selectedUnitIds.length) {
      this.setState({selectedUnitIds: []})
    } else {
      this.setState({selectedUnitIds: this.state.archivedUnits.map(u => u.id)})
    }
  };

  toggleSelected = e => {
    const newSelectedUnitIds = this.state.selectedUnitIds
    const selectedIndex = newSelectedUnitIds.findIndex(unitId => unitId == e.target.id)
    if (selectedIndex === -1) {
      newSelectedUnitIds.push(e.target.id)
    } else {
      newSelectedUnitIds.splice(selectedIndex, 1)
    }
    this.setState({selectedUnitIds: newSelectedUnitIds})
  };

  unarchiveUnits = () => {
    const that = this
    requestPost(
      `${import.meta.env.VITE_DEFAULT_URL}/teacher_fix/unarchive_units`,
      { unit_ids: that.state.selectedUnitIds, changed_names: that.state.changedNames },
      (body) => {
        that.setState({ archivedUnits: [], changedNames: {}, selectedUnitIds: [], teacherIdentifier: ''})
        window.alert('These units have been unarchived.')
      }
    )
  };

  updateName = (e, id) => {
    const newChangedNames = this.state.changedNames
    newChangedNames[id] = e.target.value
    this.setState({changedNames: newChangedNames})
  };

  updateTeacherIdentifier = e => {
    this.setState({teacherIdentifier: e.target.value})
  };

  renderError() {
    if(this.state.error) {
      return <p className="error">{this.state.error}</p>
    }
  }

  renderTeacherForm() {
    return (
      <div className="input-row">
        <label>Teacher Email Or Username:</label>
        <input onChange={this.updateTeacherIdentifier} type="text" value={this.state.teacherIdentifier} />
        <button onClick={this.getArchivedUnits}>Submit</button>
      </div>
    )
  }

  renderUnitsForm() {
    if (this.state.archivedUnits.length > 0) {
      const unitsList = this.state.archivedUnits.map(u => {
        const checked = this.state.selectedUnitIds.find(unitId => unitId == u.id)
        const nameFieldStyle = u.shared_name ? {'border': 'red 1px solid', 'width': '447px'} : {'width': '447px'}
        return (
          <div key={`${u.id}-${checked}`}>
            <input checked={checked} id={u.id} onChange={this.toggleSelected} type="checkbox" />
            <input onChange={(e) => this.updateName(e, u.id)} style={nameFieldStyle} value={this.state.changedNames[u.id] || u.name} />
          </div>
        )
      })
      const selectAllCopy = this.state.archivedUnits.length === this.state.selectedUnitIds.length ? 'Unselect All Units' : 'Select All Units'
      return (
        <div>
          <button className="unselect-all-button" onClick={this.toggleSelectAllUnits}>{selectAllCopy}</button>
          {unitsList}
          <button onClick={this.unarchiveUnits}>Restore Units</button>
        </div>
      )
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
