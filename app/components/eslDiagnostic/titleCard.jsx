import React, {Component} from 'react';
import beginArrow from '../../img/begin_arrow.svg';

class TitleCard extends Component {
  render() {
    return (
      <div className="landing-page">
        <div className="landing-page-html" dangerouslySetInnerHTML={{__html: this.props.data.content}}></div>
        <button className="button student-begin" onClick={this.props.nextQuestion}>
          Continue
          <img className="begin-arrow" src={beginArrow} />
        </button>
      </div>
    )
  }
}

export default TitleCard
