import React from 'react';
import { connect } from 'react-redux';
import {
  loadResponseDataAndListen,
  stopListeningToResponses,
  listenToResponsesWithCallback
} from '../../actions/responses';
import ResponseComponent from './responseComponent.jsx';

const ResponseComponentWrapper = React.createClass({
  getInitialState() {
    return {
      responses: {},
      loadedResponses: false,
    };
  },

  componentWillMount() {
    const { questionID, } = this.props.params;
    console.log('PARAMS: ', this.props.params);
    // this.props.dispatch(loadResponseDataAndListen(questionID));
    listenToResponsesWithCallback(
      questionID,
      (data) => {
        this.setState({
          responses: data,
          loadedResponses: true,
        });
      }
    );
  },

  componentWillUnmount() {
    console.log('Unmounting');
    const { questionID, } = this.props.params;
    this.props.dispatch(stopListeningToResponses(questionID));
  },

  getResponses() {
    return this.state.responses;
  },

  render() {
    const { data, states, } = this.props.questions;
    const { questionID, } = this.props.params;
    if (this.state.loadedResponses) {
      return (
        <ResponseComponent
          question={data[questionID]}
          responses={this.getResponses()}
          questionID={questionID}
          states={states}
          dispatch={this.props.dispatch}
          admin
        />
      );
    } else {
      return (
        <p>Loading</p>
      );
    }
  },
});

function select(state) {
  return {
    questions: state.questions,
    routing: state.routing,
  };
}

export default connect(select)(ResponseComponentWrapper);
