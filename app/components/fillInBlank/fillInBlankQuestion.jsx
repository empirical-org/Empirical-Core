import React, { Component } from 'react';
import { connect } from 'react-redux';

class ClassName extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        New Component
      </div>
    );
  }

}

function select(props) {
  return {
    Key: props.Value,
  };
}

export default connect(select)(ClassName);
