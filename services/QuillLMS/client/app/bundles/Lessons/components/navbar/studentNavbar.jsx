import React from 'react';
import { connect } from 'react-redux';
import StudentLessonsNavBar from './studentLessonsNavbar.jsx';

class Navbar extends React.Component {
  render() {
    return <StudentLessonsNavBar />;
  }
}

function select(state) {
  return {
    routing: state.routing,
    playDiagnostic: state.playDiagnostic,
  };
}

export default connect(select)(Navbar);
