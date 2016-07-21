import React, { Component } from 'react'
import Pie from 'react-simple-pie-chart'
export default React.createClass ({

  getInitialState: function () {
    return {
      expandedSector: null
    }
  },

  handleMouseEnterOnSector: function (sector) {
    this.setState({ expandedSector: sector })
  },

  handleMouseLeaveFromSector: function () {
    this.setState({ expandedSector: null })
  },

  render: function () {
    return (
      <div id='pie-chart'>
          <Pie
            slices= {this.props.data}

          />
        {
          this.props.data.map((d, i) => (
            <div key={ i }>
              <span style={{ backgroundColor: d.color, width: '20px', marginRight: 5, color: d.color, borderRadius: '100%' }}>OO</span>
              <span style={{ fontWeight: this.state.expandedSector == i ? 'bold' : null }}>
                { d.label }: { d.value }
              </span>
            </div>
          ))
        }
        {
          this.props.total ?
            <div>
              <span style={{marginRight: '28px'}}></span>
              <span>Total: {this.props.total}</span>
            </div>
          : ''
        }
          <a href="https://github.com/empirical-org/Quill-Connect/blob/master/app/libs/README.md">How our marking works</a>
      </div>
    )
  }
})
