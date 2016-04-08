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
    console.log(this.props.data)
    return (
      <div className='columns'>
        <div className='column'>
          <Pie
            slices= {this.props.data}

          />
        </div>
        <div className="column">
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
        </div>
      </div>
    )
  }
})
