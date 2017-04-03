import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import _ from 'underscore';
import Modal from '../modal/modal.jsx';
import { hashToCollection } from '../../libs/hashToCollection';
import C from '../../constants';
import ConceptSelector from './conceptSelector.jsx';
import ConceptSelectorWithCheckbox from './conceptSelectorWithCheckbox.jsx';

export default React.createClass({

  propTypes: {
    item: React.PropTypes.any,
    onSubmit: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    const item = this.props.item;
    return ({
      modalDisplay: false,
      itemText: item ? `${item.text}|||` : '',
      itemFeedback: item ? item.feedback : '',
      itemConcepts: item ? (item.conceptResults ? item.conceptResults : {}) : {},
    });
  },

  addOrEditFocusPoint() {
    return this.props.item ? 'Edit Focus Point' : 'Add New Focus Point';
  },

  toggleFocusPointForm(item) {
    let state = { modalDisplay: !this.state.modalDisplay, };
    if (item) {
      state = Object.assign(state, {
        itemText: item.text ? `${item.text}|||` : '',
        itemFeedback: item.feedback,
        itemConcepts: item.conceptResults ? item.conceptResults : {},
      });
    } else {
      state = Object.assign(state, {
        itemText: '',
        itemFeedback: '',
        itemConcepts: {},
      });
    }
    this.setState(state);
  },

  handleChange(stateKey, e) {
    const obj = {};
    let value = e.target.value;
    if (stateKey == 'itemText') {
      value = `${Array.from(document.getElementsByClassName('focus-point-text')).map(i => i.value).filter(val => val !== '').join('|||')}|||`;
    }
    obj[stateKey] = value;
    this.setState(obj);
  },

  handleConceptChange(e) {
    const concepts = this.state.itemConcepts;
    if (!concepts.hasOwnProperty(e.value)) {
      concepts[e.value] = { correct: true, name: e.name, };
      this.setState({
        itemConcepts: concepts,
      });
    }
  },

  submit(focusPoint) {
    const data = {
      text: this.state.itemText.split('|||').filter(val => val !== '').join('|||'),
      feedback: this.state.itemFeedback,
      conceptResults: this.state.itemConcepts,
    };
    this.props.onSubmit(data, focusPoint);
    this.toggleFocusPointForm();
  },

  renderTextInputFields() {
    return this.state.itemText.split('|||').map(text => (
      <input className="input focus-point-text" style={{ marginBottom: 5, }} onChange={this.handleChange.bind(null, 'itemText')} type="text" value={text || ''} />
    ));
  },

  renderConceptSelectorFields(item) {
    const components = _.mapObject(Object.assign({}, this.state.itemConcepts, { null: { correct: false, text: 'This is a placeholder', }, }), (val, key) => (
      <ConceptSelectorWithCheckbox
        handleSelectorChange={this.handleConceptChange}
        currentConceptUID={key}
        checked={val.correct}
        onCheckboxChange={() => this.toggleCheckboxCorrect(key)}
      />
    ));
    return _.values(components);
  },

  toggleCheckboxCorrect(key) {
    const data = this.state;
    data.itemConcepts[key].correct = !data.itemConcepts[key].correct;
    this.setState(data);
  },

  modal(focusPoint) {
    const item = this.props.item;
    if (this.state.modalDisplay) {
      return (
        <Modal close={this.toggleFocusPointForm}>
          <div className="box">
            <h4 className="title">{this.addOrEditFocusPoint()}</h4>
            <div className="control">
              <label className="label">Focus Point Text</label>
              {this.renderTextInputFields()}
              <label className="label" style={{ marginTop: 10, }}>Feedback</label>
              <input className="input" style={{ marginBottom: 5, }} onChange={this.handleChange.bind(null, 'itemFeedback')} type="text" value={this.state.itemFeedback || ''} />
              <label className="label" style={{ marginTop: 10, }}>Concepts</label>
              {this.renderConceptSelectorFields(focusPoint)}
            </div>
            <p className="control">
              <button className={'button is-primary '} onClick={() => this.submit(focusPoint)}>Submit</button>
            </p>
          </div>
        </Modal>
      );
    }
  },

  render() {
    const item = this.props.item;
    if (item) {
      return (
        <footer className="card-footer">
          <a onClick={() => this.toggleFocusPointForm(item)} className="card-footer-item">Edit</a>
          <a onClick={() => this.props.delete(item.id)} className="card-footer-item">Delete</a>
          {this.modal(item.id)}
        </footer>
      );
    } else {
      return (
        <div style={{ display: 'inline-block', float: 'right', }}>
          <button type="button" className="button is-outlined is-primary" onClick={() => this.toggleFocusPointForm(null)}>Add Focus Point</button>
          {this.modal(null)}
        </div>
      );
    }
  },

});
