import * as React from 'react'
import { BrowserRouter, Route, } from 'react-router-dom';

import AttributesManager from '../components/attributesManager/index'

const AttributesManagerIndex = () => {
  return (
    <BrowserRouter>
      <Route component={AttributesManager} path='/cms/attributes_manager' />
    </BrowserRouter>
  )
}

export default AttributesManagerIndex
