import React from 'react';
import LockerIndex from '../components/locker/lockerIndex';
import { BrowserRouter, Route,  } from 'react-router-dom'

const LockerApp = () => (
  <BrowserRouter>
    <Route component={LockerIndex} path="/" />
  </BrowserRouter>
);

export default LockerApp
