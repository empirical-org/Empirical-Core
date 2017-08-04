'use strict'

import React from 'react'

export default  React.createClass({

  propTypes: {
    handleFilterButtonClick: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool
  },


  handleClick: function() {
    this.props.handleFilterButtonClick(this.props.data.id)
  },

  iconType: function() {
    let type = this.props.data.key;
    if (type === 'passage') {
      type = 'flag';
    } else if (type === 'sentence') {
      type = 'puzzle';
    }
    return type;
  },

  description: function() {
    switch(this.props.data.key) {
    case 'connect':
        return 'Combine Sentences';
    case 'sentence':
        return 'Practice Basic Grammar';
    case 'passage':
        return 'Find & Fix Errors in Passages';
    case 'diagnostic':
        return 'Identify Learning Gaps';
      }
  },

  render: function() {
    let active = this.props.active ? 'active' : null;
    return (
      <button className={active} onClick={()=> this.handleClick()}>
        <div className={`icon-${this.iconType()}-gray`}></div>
        <div>
          <h4>{this.props.data.alias}</h4>
          <p>{this.description()}</p>
        </div>
      </button>
    );
  }


});
