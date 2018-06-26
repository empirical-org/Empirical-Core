import React, { Component } from 'react';
const icon = 'http://cdn.quill.org/images/icons/question_icon.svg'
import Cues from '../renderForQuestions/cues.jsx';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import activeComponent from 'react-router-active-component';
import fillInTheBlankActions from '../../actions/fillInBlank';
const NavLink = activeComponent('li');

class FillInBlankQuestion extends Component {
  constructor() {
    super();
    this.getQuestion = this.getQuestion.bind(this);
  }

  getQuestion() {
    const { questionID, } = this.props.params;
    return this.props.fillInBlank ? this.props.fillInBlank.data[questionID] : null;
  }

  isLoading() {
    const loadingData = this.props.fillInBlank.hasreceiveddata === false;
    return loadingData;
  }

  render() {
    const { questionID} = this.props.params;
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (this.getQuestion()) {
      const activeLink = this.props.massEdit.numSelectedResponses > 1
      ? <NavLink activeClassName="is-active" to={`/admin/fill-in-the-blanks/${questionID}/mass-edit`}>Mass Edit ({this.props.massEdit.numSelectedResponses})</NavLink>
      : <li style={{color: "#a2a1a1"}}>Mass Edit ({this.props.massEdit.numSelectedResponses})</li>
      const data = this.props.fillInBlank.data
      return (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }}/>
            <h4 style={{color: '#00c2a2'}} className="title">Flag: {data[questionID].flag}</h4>
          </div>
          <Cues
            getQuestion={this.getQuestion}
            displayArrowAndText={true}
          />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{this.getQuestion().instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>
            {<Link to={`admin/fill-in-the-blanks/${questionID}/edit`} className="button is-outlined is-primary">Edit Question</Link>}
          </p>
          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`admin/fill-in-the-blanks/${questionID}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to={`admin/fill-in-the-blanks/${questionID}/test`}>Play Question</NavLink>
              {activeLink}
            </ul>
          </div>
          {this.props.children}
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
