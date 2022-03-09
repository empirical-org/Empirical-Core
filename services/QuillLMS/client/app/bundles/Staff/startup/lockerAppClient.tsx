import React from 'react';
import LockerApp from '../components/locker/lockerApp';
import { HashRouter, Route } from 'react-router-dom'

const LockerAppClient = () => (
  <HashRouter>
    <Route component={LockerApp} path="/" />
  </HashRouter>
);

export default LockerAppClient
