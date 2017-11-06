import React, { Component, PropTypes } from 'react';
import NavBar from '../navbar/navbar';
import { connect } from 'react-redux';

import {
  getCurrentUserFromLMS,
  getEditionsByUser
} from '../../actions/customize'

class Customize extends React.Component {
  constructor(props) {
    super(props)
    this.props.dispatch(getCurrentUserFromLMS())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.customize.user_id !== this.props.customize.user_id) {
      this.props.dispatch(getEditionsByUser(nextProps.customize.user_id))
    }
  }

  render() {
    return (
      <div>
        <NavBar params={this.props.params}/>
        {this.props.children}
      </div>
    );
  }
}

function select(state) {
  return {
    customize: state.customize
  }
}

export default connect(select)(Customize)
