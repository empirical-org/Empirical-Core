import { Editor } from 'slate-react'
import Plain from 'slate-plain-serializer'
import * as React from 'react'

class HoverForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayText: '',
      correctText: ''
    }

    this.changeDisplayText = this.changeDisplayText.bind(this)
    this.changeCorrectText = this.changeCorrectText.bind(this)
  }

  onClickMark(event, type) {
    const { value, onChange } = this.props
    event.preventDefault()
    const change = value.change().toggleMark(type)
    onChange(change)
  }

  changeDisplayText(e) {
    this.setState({ displayText: e.target.value })
  }

  changeCorrectText(e) {
    this.setState({ correctText: e.target.value })
  }

  render() {
    const { className, ref } = this.props
    const root = window.document.getElementById('root')

    return <div className={className} ref={ref}>
      <label>Display Text</label>
      <input onChange={this.changeDisplayText} value={this.state.displayText}/>
      <label>Correct Text</label>
      <input onChange={this.changeCorrectText} value={this.state.correctText}/>

    </div>
  }

}

class PassageCreator extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value: Plain.deserialize('')
    }
  }

  // componentDidMount() {
  //   this.updateForm()
  // }
  //
  // componentDidUpdate() {
  //   this.updateForm()
  // }

  updateForm = () => {
    const menu = this.menu
    if (!menu) return

    const { value } = this.state
    const { fragment, selection } = value

    if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
      menu.style = {}
      return
    }

    const native = window.getSelection()
    const range = native.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    menu.style.opacity = 1
    menu.style.top = `${rect.top + window.pageYOffset - menu.offsetHeight}px`

    menu.style.left = `${rect.left +
      window.pageXOffset -
      menu.offsetWidth / 2 +
      rect.width / 2}px`
  }

  onChange = ({ value }) => {
    console.log('wtf')
    this.setState({ value })
  }

  render() {
    // <HoverForm
    //   value={this.state.value}
    //   onChange={this.onChange}
    //   ref={menu => (this.menu = menu)}
    // />

    return (
      <div>
        <Editor
          placeholder="Enter some text..."
          value={this.state.value}
          onChange={this.onChange}
          style={{minHeight: '50px', border: '1px solid black'}}
        />
      </div>
    )
  }
}

/**
 * Export.
 */

export default PassageCreator
