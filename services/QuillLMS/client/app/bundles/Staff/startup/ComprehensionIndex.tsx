import React from 'react';
import ComprehensionLanding from '../components/comprehension/ComprehensionLanding';
import { HashRouter, Route,  } from 'react-router-dom'

const ComprehensionIndex = () => (
  <HashRouter>
    <Route component={ComprehensionLanding} path="/" />
  </HashRouter>
);

export default ComprehensionIndex
