import 'babel-polyfill';
import React, { Component, PropTypes } from 'react';
import NavBar from './navbar/studentNavbar.jsx';

export default React.createClass({
  render() {
    return (
      <div>
        <NavBar />
        {this.props.children}
      </div>
    );
  },
});
