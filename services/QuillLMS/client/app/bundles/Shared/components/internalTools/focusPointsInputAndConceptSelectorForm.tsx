import * as React from 'react';

import { RegexInputAndConceptSelectorForm, FOCUS_POINT, } from './regexInputAndConceptSelectorForm'

export const FocusPointsInputAndConceptSelectorForm = (props) => (
  <RegexInputAndConceptSelectorForm
    {...props}
    focusPointOrIncorrectSequence={FOCUS_POINT}
  />
)
