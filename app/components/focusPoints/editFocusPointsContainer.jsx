import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import MultipleInputAndConceptSelectorForm from '../shared/multipleInputAndConceptSelectorForm.jsx';
import questionActions from '../../actions/questions.js';

class EditFocusPointsContainer extends Component {

}

function select(props) {
  return {
    questions: props.questions,
  };
}

export default connect(select)(EditFocusPointsContainer);
