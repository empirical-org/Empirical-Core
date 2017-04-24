import React, { Component } from 'react';
import icon from '../../img/question_icon.svg';
import Cues from '../renderForQuestions/cues.jsx';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import activeComponent from 'react-router-active-component';
import questionActions from '../../actions/questions';
const NavLink = activeComponent('li');

class ClassName extends Component {
  constructor() {
    super();
    this.getQuestion = this.getQuestion.bind(this);
    this.deleteQuestion = this.deleteQuestion.bind(this);
  }

  getQuestion() {
    const { questionID, } = this.props.params;
    return this.props.fillInBlank.data[questionID];
  }

  isLoading() {
    const loadingData = this.props.fillInBlank.hasreceiveddata === false;
    return loadingData;
  }

  deleteQuestion() {
    this.props.dispatch(questionActions.deleteQuestion(this.props.params.questionID));
  }

  render() {
    const { questionID, } = this.props.params;
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (this.getQuestion()) {
      return (
        <div>
          <h4 className="title" dangerouslySetInnerHTML={{ __html: this.getQuestion().prompt, }} style={{ marginBottom: 0, }} />
          <Cues getQuestion={this.getQuestion} />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img className="info" src={icon} />
            <p>{this.getQuestion().instructions || 'Combine the sentences into one sentence.'}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>
            {<Link to={`admin/fill-in-the-blanks/${questionID}/edit`} className="button is-outlined is-primary">Edit Question</Link>}
            {<Link to={'admin/questions'} className="button is-outlined is-danger" onClick={this.deleteQuestion}>Delete Question</Link>}
          </p>
          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`admin/fill-in-the-blanks/${questionID}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to={`admin/fill-in-the-blanks/${questionID}/test`}>Play Question</NavLink>
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
  };
}

export default connect(select)(ClassName);
