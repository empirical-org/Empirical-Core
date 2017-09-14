import React from 'react'
import request from 'request'

export default class UnarchiveUnits extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      archivedUnits: [],
      selectedUnits: [],
      teacherIdentifier: ''
    }

    this.updateTeacherIdentifier = this.updateTeacherIdentifier.bind(this)
    this.getArchivedUnits = this.getArchivedUnits.bind(this)
  }

  updateTeacherIdentifier(e) {
    this.setState({teacherIdentifier: e.target.value})
  }

  getArchivedUnits() {
    const that = this
    that.setState({archivedUnits: [], selectedUnits: [], error: ''})
    request.get({
      url: `${process.env.DEFAULT_URL}/teacher_fix/get_archived_units`,
      qs: {teacher_identifier: that.state.teacherIdentifier}
    },
    (e, r, response) => {
      const parsedResponse = JSON.parse(response)
      if (parsedResponse.error) {
        that.setState({error: parsedResponse.error})
      } else if (parsedResponse.archived_units)
      that.setState({ archivedUnits: parsedResponse.archived_units, });
    });
  }

  renderForm() {
    return <div>
      <label>Teacher Email Or Username:</label>
      <input type="text" value={this.state.teacherIdentifier} onChange={this.updateTeacherIdentifier}/>
      <button onClick={this.getArchivedUnits}>Submit</button>
    </div>
  }

  renderUnits() {
    if (this.state.archivedUnits.length > 0) {
      return this.state.archivedUnits.map(u => <p key={u.id}>{u.name}</p>)
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
        <h1>Unarchive Units</h1>
        {this.renderForm()}
        {this.renderError()}
        {this.renderUnits()}
      </div>
  )}
}
