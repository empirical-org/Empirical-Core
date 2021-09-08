import React from 'react';
import EvidenceLanding from '../components/evidence/EvidenceLanding';
import { HashRouter, Route,  } from 'react-router-dom'

const EvidenceIndex = () => (
  <HashRouter>
    <Route component={EvidenceLanding} path="/" />
  </HashRouter>
);

export default EvidenceIndex
