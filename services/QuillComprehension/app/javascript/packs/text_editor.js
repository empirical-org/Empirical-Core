import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReactQuill from 'react-quill'

class TextEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {text: this.props.text}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    this.setState({ text: value })
    document.getElementById(this.props.fieldName).value = this.state.text
  }

  render() {
    return <ReactQuill value={this.state.text} onChange={this.handleChange} />
  }

}

document.addEventListener('DOMContentLoaded', () => {
  var formGroups = document.getElementsByClassName("text-editor")
  for (var i = 0; i < formGroups.length; i++) {
    var oldInput = formGroups[i].getElementsByClassName("form-control")[0]
    var newInput = document.createElement("div")
    formGroups[i].appendChild(newInput)
    ReactDOM.render(
      <TextEditor fieldName={oldInput.id} text={oldInput.value}/>,
      newInput
    )
  }
})
