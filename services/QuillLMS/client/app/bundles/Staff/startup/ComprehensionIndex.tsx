import React from 'react';
import ComprehensionLanding from '../containers/comprehension/ComprehensionLanding';
import { HashRouter, Route,  } from 'react-router-dom'

const ComprehensionIndex = () => (
  <HashRouter>
    <Route component={ComprehensionLanding} exact path="/" />
  </HashRouter>
);

export default ComprehensionIndex
