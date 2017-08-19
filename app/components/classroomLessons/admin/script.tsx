import React, {Component} from 'react'

class Script extends Component {
  constructor(props){
    super(props);
  }

  renderScriptItems() {
    return Object.keys(this.props.script).map((scriptItem) => {
      return (<li>{this.props.script[scriptItem].type}</li>)
    })
  }

  render() {
    return (
      <ul>
        {this.renderScriptItems()}
      </ul>
    )
  }

}

export default Script
