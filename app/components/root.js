import 'babel-polyfill';
import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux'
import {} from '../actions'
import Welcome from "./welcome/welcome.jsx";
import DevTools from '../utils/devTools';
import "../styles/style.scss";

var Root = React.createClass({

  startActivity: function (questions) {
    const data = questions;
    const loadDataActions = loadData(data);
    this.props.dispatch(loadDataActions);
    const action = nextQuestion();
    this.props.dispatch(action);
  },

  stateSpecificComponent: function () {
    return (<Welcome start={this.startActivity}/>)
  },

  render(){
    const { dispatch} = this.props;

    return (
      <div>
        {this.stateSpecificComponent()}
        <DevTools/>
      </div>
    )
  }
});

function select(state) {
  return {
  }
}


export default connect(select)(Root)
