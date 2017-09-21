import 'babel-polyfill';
import React, { Component, PropTypes } from 'react';
import NavBar from './navbar/navbar.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <NavBar params={this.props.params}/>
        {this.props.children}
      </div>
    );
  },
});
