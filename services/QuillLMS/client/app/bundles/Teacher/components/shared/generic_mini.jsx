'use strict'

import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <div className='generic-mini' key={this.props.title} onClick={this.changeView}>
        {this.props.children}
      </div>
    )
  }
}
