import React from 'react';
import { HashRouter, Route,  } from 'react-router-dom'

import ComprehensionLanding from '../components/comprehension/ComprehensionLanding';

const ComprehensionIndex = () => (
  <HashRouter>
    <Route component={ComprehensionLanding} path="/" />
  </HashRouter>
);

export default ComprehensionIndex
