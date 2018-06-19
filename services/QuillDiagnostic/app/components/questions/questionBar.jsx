import React, { Component } from 'react';

export default React.createClass({

  render() {
    return (
      <div style={{ height: 10, marginBottom: 15, }}>
        {
          this.props.data.map((d, i) => (
            <div
              key={i}
              style={{
                backgroundColor: d.color,
                display: 'inline-block',
                width: `${d.value}%`,
                height: '100%', }}
            />
          ))
        }
      </div>
    );
  },

});
