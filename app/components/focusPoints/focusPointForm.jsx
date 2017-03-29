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
      fpText: fp ? fp.text + '|||' : '',
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
    let value = e.target.value;
    if(stateKey == 'fpText') {
      value = Array.from(document.getElementsByClassName('focus-point-text')).map(i=>i.value).filter((val)=>val!=='').join("|||") + "|||";
    }
    obj[stateKey] = value;
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

  renderTextInputFields: function() {
    return this.state.fpText.split("|||").map((text) => (
      <input className="input focus-point-text" style={{marginBottom: 5}} onChange={this.handleChange.bind(null, 'fpText')} type="text" value={text || ''} />
    ));
  },

  modal: function(newFocusPoint) {
    let fp = this.props.fp;
    if (this.state.modalDisplay) {
      return (
        <Modal close={this.toggleFocusPointForm}>
        <div className="box">
        <h4 className="title">{this.addOrEditFocusPoint()}</h4>
        <div className="control">
        <label className="label">Focus Point Text</label>
        {this.renderTextInputFields()}
        <label className="label" style={{marginTop: 10}}>Feedback</label>
        <input className="input" style={{marginBottom: 5}} onChange={this.handleChange.bind(null, 'fpFeedback')} type="text" value={this.state.fpFeedback || ''} />
        <label className="label" style={{marginTop: 10}}>Concept (Users who hit this focus point will recieve a false concept result for this)</label>
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
        <div style={{display: 'inline', float: 'right'}}>
          <button type="button" className="button is-outlined is-primary" onClick={this.toggleFocusPointForm}>Add Focus Point</button>
          {this.modal(true)}
        </div>
      );
    }
  }

});
