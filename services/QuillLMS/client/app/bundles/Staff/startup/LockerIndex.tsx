import React from 'react';
import LockerLanding from '../components/locker/LockerLanding';
import { BrowserRouter, Route,  } from 'react-router-dom'

const LockerIndex = () => (
  <BrowserRouter>
    <Route component={LockerLanding} path="/" />
  </BrowserRouter>
);

export default LockerIndex
