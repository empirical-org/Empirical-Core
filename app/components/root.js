import 'babel-polyfill';
import React, { Component, PropTypes } from "react";
import { connect } from 'react-redux'
import {} from '../actions'
import Welcome from "./welcome/welcome.jsx";
import DevTools from '../utils/devTools';
import NavBar from './navbar/navbar.jsx';
import Footer from './footer/footer.jsx';
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
    const { dispatch } = this.props;

    return (
      <div>
        <NavBar/>
        {this.props.children}
      </div>
    )
  }
});

function select(state) {
  return {
    question: state.question,
    routing: state.routing
  }
}


export default connect(select)(Root)
