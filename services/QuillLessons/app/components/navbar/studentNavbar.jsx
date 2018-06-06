import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import StudentLessonsNavBar from './studentLessonsNavbar.jsx';

const Navbar = React.createClass({
  render() {
    return <StudentLessonsNavBar />;
  },
});

function select(state) {
  return {
    routing: state.routing,
    playDiagnostic: state.playDiagnostic,
  };
}

export default connect(select)(Navbar);
