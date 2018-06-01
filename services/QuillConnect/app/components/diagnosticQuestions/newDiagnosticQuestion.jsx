import React, { Component } from 'react';
import { connect } from 'react-redux';
import diagnosticQuestionActions from '../../actions/diagnosticQuestions.js';
import DiagnosticQuestionForm from './diagnosticQuestionForm.jsx';


class NewDiagnosticQuestion extends Component {
	constructor() {
		super();
		this.submitNewQuestion = this.submitNewQuestion.bind(this);
	}

	submitNewQuestion(data) {
		this.props.dispatch(diagnosticQuestionActions.submitNewQuestion(data, 
			{text: data.prefilledText,
			optimal: true,
        	feedback: "That's a great sentence!",
        	count: 0,
			}));
	}

	render() {
		return (
			<DiagnosticQuestionForm submit={this.submitNewQuestion} itemLevels={this.props.itemLevels} concepts={this.props.concepts} />
		);
	}
}

function select(state) {
  return {
  	concepts: state.concepts,
  	itemLevels: state.itemLevels,
  };
}

export default connect(select)(NewDiagnosticQuestion);