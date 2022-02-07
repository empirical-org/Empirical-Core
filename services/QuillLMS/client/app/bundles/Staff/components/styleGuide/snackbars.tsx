import * as React from 'react'
import { Snackbar, defaultSnackbarTimeout } from '../../../Shared/index'

class Snackbars extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      visible: false
    }

    this.triggerSnackbar = this.triggerSnackbar.bind(this)
  }

  triggerSnackbar() {
    this.setState({visible: true}, () => {
      setTimeout(() => this.setState({ visible: false, }), defaultSnackbarTimeout)
    })
  }

  render() {
    return (
      <div id="snackbars">
        <h2 className="style-guide-h2">Snackbars</h2>
        <div className="element-container">
          <pre>
            {`constructor(props) {
  super(props)

  this.state = {
    visible: false
  }

  this.triggerSnackbar = this.triggerSnackbar.bind(this)
}

triggerSnackbar() {
  # Note that defaultSnackbarTimeout here is imported from the Snackbar module
  this.setState({visible: true}, () => {
    setTimeout(() => this.setState({ visible: false, }), defaultSnackbarTimeout)
  })
}

render() {
  return <div>
    <button className="quill-button medium primary contained" onClick={this.triggerSnackbar}>Click Me</button>
    <Snackbar text="I am a snackbar!" visible={this.state.visible} />
  </div>
}

`}
          </pre>
          <button className="quill-button medium primary contained" onClick={this.triggerSnackbar}>Click Me</button>
        </div>
        <Snackbar text="I am a snackbar!" visible={this.state.visible} />
      </div>
    )
  }

}

export default Snackbars
