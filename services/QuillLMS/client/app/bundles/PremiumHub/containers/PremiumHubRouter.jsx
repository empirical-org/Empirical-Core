import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import PremiumHubContainer from './PremiumHubContainer';

export default function PremiumHubRouter(props) {
  return (
    <BrowserRouter>
      <CompatRouter>
        <Route
          path="/teachers/premium_hub"
          render={passedProps => (
            <PremiumHubContainer {...props} {...passedProps} />
          )}
        />
      </CompatRouter>
    </BrowserRouter>
  )
}
