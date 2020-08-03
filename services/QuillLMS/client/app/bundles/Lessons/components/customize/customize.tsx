import * as React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import Edition from './edition'
import ChooseEdition from './chooseEdition'

const Customize = () => (
  <Switch>
    <Route component={Edition} path='/customize/:lessonID/:editionID/success' />
    <Route component={Edition} path='/customize/:lessonID/:editionID' />
    <Route component={ChooseEdition} path='/customize/:lessonID' />
  </Switch>
)

export default withRouter(Customize)
