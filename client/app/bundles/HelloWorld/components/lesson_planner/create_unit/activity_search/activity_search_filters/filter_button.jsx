'use strict'

import React from 'react'
require('../../../../../../../assets/styles/app-variables.scss')


export default  React.createClass({

  propTypes: {
    selectFilterOption: React.PropTypes.func.isRequired,
    data: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {active: false};
  },

  handleClick: function() {
    this.props.selectFilterOption(this.props.data.id);
    this.setState({active: true});
  },

  iconType: function() {
    let type = this.props.data.name;
    if (type === 'passage') {
      type = 'puzzle';
    } else if (type === 'sentence') {
      type = 'flag';
    }
    return type;
  },

  description: function() {
    switch(this.props.data.name) {
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
    let active = this.state.active ? 'active' : null;
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
