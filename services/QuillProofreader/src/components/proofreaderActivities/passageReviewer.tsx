import * as React from 'react';

import * as jsdiff from 'diff'
import * as _ from 'underscore'

export default class PassageReviewer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      text: props.text
    }
  }

}
