import * as React from 'react'
import * as ReactDOM from 'react-dom'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'


class TextEditor extends React.Component {

  constructor(props) {
    super(props)
    this.state = {text: ''}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(value) {
    this.setState({ text: value })
    //TODO: Fix this hardcoding of component name
    document.getElementById('activity_article').value = this.state.text
  }

  render() {
    return <ReactQuill value={this.state.text} onChange={this.handleChange} theme="snow"/>
  }

}

document.addEventListener('DOMContentLoaded', () => {
  const form_editor = document.getElementById('quill-react-text-editor')
  ReactDOM.render(
    <TextEditor />,
    form_editor,
  )
})
