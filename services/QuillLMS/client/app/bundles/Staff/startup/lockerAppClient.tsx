import React from 'react';
import LockerApp from '../components/locker/lockerApp';
import { BrowserRouter, Route,  } from 'react-router-dom'

const LockerAppClient = () => (
  <BrowserRouter>
    <Route component={LockerApp} path="/" />
  </BrowserRouter>
);

export default LockerAppClient
