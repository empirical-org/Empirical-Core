import React from 'react'

export default class ListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div {...this.props} className="list-item">{this.props.children}</div>
    )
  }
}
