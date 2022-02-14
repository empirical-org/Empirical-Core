import React, { Component } from 'react';
import { Link, NavLink, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Cues from '../renderForQuestions/cues.tsx';
import EditFillInBlank from './editFillInBlank.jsx';
import TestFillInBlankQuestionContainer from './testFillInBlankQuestionContainer.jsx';
import ResponseComponentWrapper from '../questions/responseRouteWrapper.jsx';
import MassEditContainer from '../questions/massEditContainer.jsx';

const icon = `${process.env.CDN_URL}/images/icons/direction.svg`

class FillInBlankQuestion extends Component {

  getQuestion = () => {
    const { match, fillInBlank, } = this.props
    const { params } = match
    const { questionID, } = params;
    return fillInBlank ? fillInBlank.data[questionID] : null;
  }

  isLoading = () => {
    const { fillInBlank, } = this.props
    return !fillInBlank.hasreceiveddata
  }

  render() {
    const { match, massEdit, fillInBlank } = this.props
    const { params } = match
    const { questionID} = params;
    const question = this.getQuestion();
    if (this.isLoading()) {
      return (<p>Loading...</p>);
    } else if (question) {
      const activeLink = massEdit.numSelectedResponses > 1
        ? <NavLink activeClassName="is-active" to={`/admin/fill-in-the-blanks/${questionID}/mass-edit`}>Mass Edit ({massEdit.numSelectedResponses})</NavLink>
        : <li style={{color: "#a2a1a1"}}>Mass Edit ({massEdit.numSelectedResponses})</li>
      const data = fillInBlank.data
      return (
        <div className="admin-container">
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h4 className="title" dangerouslySetInnerHTML={{ __html: data[questionID].prompt, }} />
            <h4 className="title" style={{color: '#00c2a2'}}>Flag: {data[questionID].flag}</h4>
          </div>
          <Cues
            displayArrowAndText={true}
            question={question}
          />
          <div className="feedback-row student-feedback-inner-container admin-feedback-row">
            <img alt="Directions Icon" className="info" src={icon} />
            <p>{question.instructions || 'Fill in the blank with the correct option.'}</p>
          </div>
          <p className="control button-group" style={{ marginTop: 10, }}>
            <Link className="button is-outlined is-primary" to={`/admin/fill-in-the-blanks/${questionID}/edit`}>Edit Question</Link>
          </p>
          <div className="tabs">
            <ul>
              <NavLink activeClassName="is-active" to={`/admin/fill-in-the-blanks/${questionID}/responses`}>Responses</NavLink>
              <NavLink activeClassName="is-active" to={`/admin/fill-in-the-blanks/${questionID}/test`}>Play Question</NavLink>
              {activeLink}
            </ul>
          </div>
          <Switch>
            <Route component={ResponseComponentWrapper} path="/admin/fill-in-the-blanks/:questionID/responses" />
            <Route component={MassEditContainer} path="/admin/fill-in-the-blanks/:questionID/mass-edit" />
            <Route component={TestFillInBlankQuestionContainer} path="/admin/fill-in-the-blanks/:questionID/test" />
            <Route component={EditFillInBlank} path="/admin/fill-in-the-blanks/:questionID/edit" />
          </Switch>
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

export default withRouter(connect(select)(FillInBlankQuestion));
