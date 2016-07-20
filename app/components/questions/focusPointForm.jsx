import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
// import questionActions from '../../actions/questions'
import _ from 'underscore'
import Modal from '../modal/modal.jsx'
// import {hashToCollection} from '../../libs/hashToCollection'
import C from '../../constants'

export default React.createClass({
    propTypes: {
        getFocusPoint: React.PropTypes.func.isRequired

    },

    getInitialState: function() {
        let fp = this.props.getFocusPoint();
        return ({modalDisplay: false,
          fpText: fp ? fp.text : '',
          fpFeedback: fp ? fp.feedback : ''
        });
    },

    addOrEditFocusPoint: function() {
        let prefix = (!!this.props.getFocusPoint()? 'Edit': 'Add New');
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

    modal: function() {
        let fp = this.props.getFocusPoint();
        if (this.state.modalDisplay) {
            return (
                <Modal close={this.toggleFocusPointForm}>
                    <div className="box">
                        <h4 className="title">{this.addOrEditFocusPoint()}</h4>
                        <p className="control">
                            <label className="label" >Focus Point Text</label>
                            <input className="input" onChange={this.handleChange.bind(null, 'fpText')} type="text" value={this.state.fpText || ''} />
                            <label className="label" >Feedback</label>
                            <input className="input" onChange={this.handleChange.bind(null, 'fpFeedback')} type="text" value={this.state.fpFeedback || ''} />
                        </p>
                        <p className="control">
                            {/*<button className={"button is-primary " + stateSpecificClass} onClick={this.submitNewConcept}>Submit</button>*/}
                            <button className={"button is-primary "}>Submit</button>
                        </p>
                    </div>
                </Modal>
              );
        }
    },

    render: function() {
        let fp = this.props.getFocusPoint();
        let classy = fp? 'is-info' : 'is-primary';
        return (
            <div>
                <button type='button' onClick={this.toggleFocusPointForm} className={'button ' + classy}>{this.addOrEditFocusPoint()}</button>
                {this.modal()}
            </div>
        );
    }

});
