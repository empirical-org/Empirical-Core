import * as React from 'react';

import { RegexInputAndConceptSelectorForm, INCORRECT_SEQUENCE, } from './regexInputAndConceptSelectorForm'

export const IncorrectSequencesInputAndConceptSelectorForm = (props) => (
  <RegexInputAndConceptSelectorForm
    {...props}
    focusPointOrIncorrectSequence={INCORRECT_SEQUENCE}
  />
)
