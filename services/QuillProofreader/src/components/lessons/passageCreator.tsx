import { Editor } from 'slate-react'
import Plain from 'slate-plain-serializer'
import * as React from 'react'

class HoverForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayText: '',
      correctText: '',
      visible: false
    }

    this.changeDisplayText = this.changeDisplayText.bind(this)
    this.changeCorrectText = this.changeCorrectText.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value.selection.isExpanded) {
      this.setState({ visible: true })
    } else {
      this.setState({ visible: false })
    }
    console.log('nextProps.value.selection.isExpanded', nextProps.value.selection.isExpanded)
  }

  style = () => {
    let style = {}
    const { visible } = this.state
    if (!visible) return { display: 'none' }

    const { value } = this.props
    const { fragment, selection } = value

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      return { display: 'none' }
    }

    const native = window.getSelection()
    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    style.opacity = 1
    style.top = `${rect.top + window.pageYOffset - style.offsetHeight}px`

    style.left = `${rect.left +
      window.pageXOffset -
      style.offsetWidth / 2 +
      rect.width / 2}px`

    return style
  }

  onClickSubmit() {
    const { value, onChange } = this.props
    const edit = `{+${this.state.correctText}-${this.state.displayText}|}`
    const change = value.change().insertText(edit)
    onChange(change)
  }

  changeDisplayText(e) {
    this.setState({ displayText: e.target.value })
  }

  changeCorrectText(e) {
    this.setState({ correctText: e.target.value })
  }

  render() {
    const { className } = this.props
    const root = window.document.getElementById('root')

    return <div className={className} style={this.style()}>
      <label>Display Text</label>
      <input onChange={this.changeDisplayText} value={this.state.displayText}/>
      <label>Correct Text</label>
      <input onChange={this.changeCorrectText} value={this.state.correctText}/>
      <button onClick={this.onClickSubmit}>Submit</button>
    </div>
  }

}

class PassageCreator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: Plain.deserialize(' ')
    }
  }

  onChange = ({ value }) => {
    console.log('wtf')
    this.setState({ value })
  }

  render() {
    return (
      <div>
        <HoverForm
          value={this.state.value}
          onChange={this.onChange}
        />
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          style={{minHeight: '50px', border: '1px solid black'}}
        />
      </div>
    )
  }
}

export default PassageCreator
