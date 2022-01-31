import * as React from 'react'
import ConceptSelector from '../shared/conceptSelector'

export default class EditGenerator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayText: '',
      correctText: '',
    }

    this.changeDisplayText = this.changeDisplayText.bind(this)
    this.changeCorrectText = this.changeCorrectText.bind(this)
    this.onClickSubmit = this.onClickSubmit.bind(this)
    this.changeConcept = this.changeConcept.bind(this)
    this.renderGeneratedEditTag = this.renderGeneratedEditTag.bind(this)
  }

  onClickSubmit() {
    const { correctText, displayText, conceptUID } = this.state
    const edit = `{+${correctText}-${displayText}|${conceptUID}}`
    this.setState({ generatedEdit: edit })
  }

  changeDisplayText(e) {
    this.setState({ displayText: e.target.value })
  }

  changeCorrectText(e) {
    this.setState({ correctText: e.target.value })
  }

  changeConcept(e) {
    this.setState({ conceptUID: e.value} )
  }

  renderGeneratedEditTag() {
    if (this.state.generatedEdit) {
      return (
        <p>
          <label className="label">Generated Edit: </label>
          <span>{this.state.generatedEdit}</span>
        </p>
      )
    }
  }

  render() {
    return (
      <div>
        <label className="label">Generate Edits</label>
        <i>Fill in the inputs and press submit to generate a formatted edit tag you can copy and paste into the passage.</i>
        <div style={{ border: 'black 1px solid', padding: '10px', marginTop: '10px' }}>
          <p>
            <label className="label">Display Text</label>
            <input className="input" onChange={this.changeDisplayText} value={this.state.displayText} />
          </p>
          <p>
            <label className="label">Correct Text</label>
            <i style={{ display: 'block' }}>If there are multiple correct edits, type them into the following field separated by a tilde (~). Example: if "loves" and "adores" are both correct, you would enter <code style={{ color: 'black', fontStyle: 'normal' }}>loves~adores</code>.</i>
            <input className="input" onChange={this.changeCorrectText} value={this.state.correctText} />
          </p>
          <p>
            <label className="label">Concept</label>
            <ConceptSelector handleSelectorChange={this.changeConcept} />
          </p>
          <button onClick={this.onClickSubmit}>Submit</button>
        </div>
        {this.renderGeneratedEditTag()}
      </div>
    )
  }

}
