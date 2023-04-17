import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import PremiumHubContainer from './PremiumHubContainer';

export default function PremiumHubRouter(props) {
  return (
    <BrowserRouter>
      <Route
        path="/teachers/premium_hub"
        render={passedProps => (
          <PremiumHubContainer {...props} {...passedProps} />
        )}
      />
    </BrowserRouter>
  )
}
