import * as React from 'react';
import { BrowserRouter, Route, } from 'react-router-dom';
import { CompatRouter } from "react-router-dom-v5-compat";

import AttributesManager from '../components/attributesManager/index';

const AttributesManagerIndex = () => {
  return (
    <BrowserRouter>
      <CompatRouter>
        <Route component={AttributesManager} path='/cms/attributes_manager' />
      </CompatRouter>
    </BrowserRouter>
  )
}

export default AttributesManagerIndex
