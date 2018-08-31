import * as React from 'react';

import * as jsdiff from 'diff'
import * as _ from 'underscore'

interface PassageReviewerProps {
  text: string;
}

interface PassageReviewerState {
  text: string;
}

export default class PassageReviewer extends React.Component<PassageReviewProps, PassageReviewerState> {
  constructor(props: PassageReviewerProps) {
    super(props)

    this.state = {
      text: props.text
    }
  }

  render() {
    return <div className="reviewer" dangerouslySetInnerHTML={{__html: this.state.text}}/>
  }

}
