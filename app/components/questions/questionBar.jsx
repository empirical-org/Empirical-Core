import React, { Component } from 'react'

export default React.createClass ({

  render: function() {
    return(
      <div style={{height: 10}}>
        {
          this.props.data.map((d, i) => (
            <div style={{
                backgroundColor: d.color,
                display: 'inline-block',
                width: d.value + '%',
                height: '100%'}
            }></div>
          ))
        }
      </div>
    )
  }

})
