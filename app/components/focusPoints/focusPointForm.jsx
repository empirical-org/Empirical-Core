import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
// import questionActions from '../../actions/questions'
import _ from 'underscore'
import Modal from '../modal/modal.jsx'
// import {hashToCollection} from '../../libs/hashToCollection'
import C from '../../constants'
import ConceptSelector from '../shared/conceptSelector.jsx'

export default React.createClass({

  propTypes: {
    fp: React.PropTypes.any.isRequired,
    submitFocusPoint: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    let fp = this.props.fp;
    return ({
      modalDisplay: false,
      fpText: fp ? fp.text : '',
      fpFeedback: fp ? fp.feedback : '',
      fpConceptUID: fp ? fp.conceptUID : ''
    });
  },

  addOrEditFocusPoint: function() {
    return this.props.fp ? 'Edit Focus Point' : 'Add New Focus Point';
  },

  toggleFocusPointForm: function() {
    this.setState({
      modalDisplay: !this.state.modalDisplay
    });
  },

  handleChange: function(stateKey, e) {
    var obj = {};
    obj[stateKey] = e.target.value;
    this.setState(obj);
  },

  handleConceptChange: function (e) {
    this.setState({
      fpConceptUID: e.value
    })
  },

  submit: function(newFocusPoint) {
    let data = {
      text: this.state.fpText,
      feedback: this.state.fpFeedback,
      conceptUID: this.state.fpConceptUID
    };
    this.props.submitFocusPoint(data, newFocusPoint);
  },

  modal: function(newFocusPoint) {
    let fp = this.props.fp;
    if (this.state.modalDisplay) {
      return (
        <Modal close={this.toggleFocusPointForm}>
        <div className="box">
        <h4 className="title">{this.addOrEditFocusPoint()}</h4>
        <div className="control">
        <label className="label" >Focus Point Text</label>
        <input className="input" onChange={this.handleChange.bind(null, 'fpText')} type="text" value={this.state.fpText || ''} />
        <label className="label" >Feedback</label>
        <input className="input" onChange={this.handleChange.bind(null, 'fpFeedback')} type="text" value={this.state.fpFeedback || ''} />
        <label className="label" >Concept (Users who hit this focus point will recieve a false concept result for this)</label>
        <ConceptSelector handleSelectorChange={this.handleConceptChange} currentConceptUID={this.state.fpConceptUID} />
        </div>
        <p className="control">
        <button className={"button is-primary "} onClick={() => this.submit(newFocusPoint)}>Submit</button>
        </p>
        </div>
        </Modal>
      );
    }
  },

  render: function() {
    let fp = this.props.fp;
    if(fp) {
      return(
        <footer className="card-footer">
          <a onClick={this.toggleFocusPointForm} className="card-footer-item">Edit</a>
          <a className="card-footer-item">Delete</a>
          {this.modal(false)}
        </footer>
      );
    } else {
      return(
        <div>
          <button type='button' onClick={this.toggleFocusPointForm}>Add Focus Point</button>
          {this.modal(true)}
        </div>
      );
    }
  }

});
