import { Editor } from 'slate-react'
import Plain from 'slate-plain-serializer'
import * as React from 'react'

class PassageCreator extends React.Component {
  constructor(props) {
    super(props)

    const text = props.originalPassage ? props.originalPassage : ' '

    this.state = {
      value: Plain.deserialize(text)
    }
  }

  onChange = ({ value }) => {
    this.setState({ value }, this.props.onChange(Plain.serialize(value)))
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
