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
    let prefix = (!!this.props.fp ? 'Edit': 'Add New');
    return prefix + ' Focus Point'
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

  submit: function(){
    let data = {
      text: this.state.fpText,
      feedback: this.state.fpFeedback,
      conceptUID: this.state.fpConceptUID
    };
    this.props.submitFocusPoint(data);
  },

  modal: function() {
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
        {/*<button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewConcept}>Submit</button>*/}
        <button className={"button is-primary "} onClick={this.submit}>Submit</button>
        </p>
        </div>
        </Modal>
      );
    }
  },

  render: function() {
    let fp = this.props.fp;
    let classy = fp? 'is-info' : 'is-primary';
    return (
      <div>
      <button type='button' onClick={this.toggleFocusPointForm} className={'button ' + classy}>{this.addOrEditFocusPoint()}</button>
      {this.modal()}
      </div>
    );
  }

});
