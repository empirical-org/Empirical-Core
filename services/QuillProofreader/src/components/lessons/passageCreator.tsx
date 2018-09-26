import { Editor } from 'slate-react'
import Plain from 'slate-plain-serializer'
import * as React from 'react'

// class HoverForm extends React.Component {
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       displayText: '',
//       correctText: '',
//       visible: false
//     }
//
//     this.changeDisplayText = this.changeDisplayText.bind(this)
//     this.changeCorrectText = this.changeCorrectText.bind(this)
//     this.onClickSubmit = this.onClickSubmit.bind(this)
//   }
//
//   componentWillReceiveProps(nextProps) {
//     if (nextProps.value.selection.isExpanded && !this.state.value) {
//       this.setState({ visible: true, value: nextProps.value.selection} )
//       this.updateStyle()
//     }
//     console.log('nextProps.value.selection', nextProps.value.selection)
//   }
//
//   // componentDidMount = () => {
//   //   this.updateStyle()
//   // }
//   //
//   // componentDidUpdate = () => {
//   //   this.updateStyle()
//   // }
//
//   updateStyle = () => {
//     const form = document.getElementById('hover-form')
//     if (!form) return
//
//     let style =  {}
//
//     const { value } = this.props
//     const { fragment, selection } = value
//
//     // if (selection.isBlurred || selection.isCollapsed || fragment.text === '') {
//     //   return { display: 'none' }
//     // }
//
//     const native = window.getSelection()
//     const range = native.getRangeAt(0)
//     const rect = range.getBoundingClientRect()
//     style.opacity = 1
//     style.top = `${rect.top + window.pageYOffset - form.offsetHeight}px`
//
//     style.left = `${rect.left +
//       window.pageXOffset -
//       form.offsetWidth / 2 +
//       rect.width / 2}px`
//
//     form.style = style
//   }
//
//   onClickSubmit() {
//     const { onChange } = this.props
//     const edit = `{+${this.state.correctText}-${this.state.displayText}|}`
//     const change = this.props.value.change().insertText(edit)
//     onChange(change)
//     this.setState({ visible: false, value: null, displayText: '', correctText: '' })
//   }
//
//   changeDisplayText(e) {
//     this.setState({ displayText: e.target.value })
//   }
//
//   changeCorrectText(e) {
//     this.setState({ correctText: e.target.value })
//   }
//
//   render() {
//     const { className } = this.props
//     const root = window.document.getElementById('root')
//     const style = this.state.visible ? null : { display: 'none '}
//
//     return <div className={className} id="hover-form" style={style}>
//       <span>
//         <label>Display Text</label>
//         <input onChange={this.changeDisplayText} value={this.state.displayText}/>
//       </span>
//       <span>
//         <label>Correct Text</label>
//         <input onChange={this.changeCorrectText} value={this.state.correctText}/>
//       </span>
//       <button onClick={this.onClickSubmit}>Submit</button>
//     </div>
//   }
//
// }

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
        <Editor
          value={this.state.value}
          onChange={this.onChange}
          style={{minHeight: '100px', border: '1px solid black', padding: '10px'}}
        />
      </div>
    )
  }
}

export default PassageCreator
