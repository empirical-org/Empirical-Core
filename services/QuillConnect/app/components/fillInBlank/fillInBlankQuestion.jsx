import React, { Component } from 'react';
import activeComponent from 'react-router-active-component';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import Cues from '../renderForQuestions/cues.jsx';
import fillInTheBlankActions from '../../actions/fillInBlank';

const icon = `${process.env.QUILL_CDN_URL}/images/icons/direction.svg`
const NavLink = activeComponent('li');

class FillInBlankQuestion extends Component {
  constructor(props) {
    super(props);
    this.getQuestion = this.getQuestion.bind(this);
  }

  getQuestion = () => {
    const { params, fillInBlank, } = this.props
    const { questionID, } = params;
    return fillInBlank ? fillInBlank.data[questionID] : null;
  }

  isLoading = () => {
    const { fillInBlank, } = this.props
    return !fillInBlank.hasreceiveddata
  }

  render() {
    const { params, massEdit, fillInBlank, children, } = this.props
    const { questionID} = params;
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (this.getQuestion()) {
      const activeLink = massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/fill-in-the-blanks/${questionID}/mass-edit`}>Mass Edit ({massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({massEdit.numSelectedResponses})</li>
      const data = fillInBlank.data
      return (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} />
            <h4 className="title" style={{color: '#00c2a2'}}>Flag: {data[questionID].flag}</h4>
          </div>
          <Cues
            displayArrowAndText={true}
            getQuestion={this.getQuestion}
          />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img alt="Directions Icon" className="info" src={icon} />
            <p>{this.getQuestion().instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>
            <Link className="button is-outlined is-primary" to={`admin/fill-in-the-blanks/${questionID}/edit`}>Edit Question</Link>
          </p>
          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`admin/fill-in-the-blanks/${questionID}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to={`admin/fill-in-the-blanks/${questionID}/test`}>Play Question</NavLink>
              {activeLink}
            </ul>
          </div>
          {children}
        </div>
      );
    } else {
      return (
        <p>404: No Question Found</p>
      );
    }
  }

}

function select(props) {
  return {
    fillInBlank: props.fillInBlank,
    massEdit: props.massEdit
  };
}

export default connect(select)(FillInBlankQuestion);
