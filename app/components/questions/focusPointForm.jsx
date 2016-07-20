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
        return ({modalDisplay: false});
    },

    addOrEditFocusPoint: function() {
        let prefix = (!!this.props.getFocusPoint()? 'Edit': 'Add New');
        return prefix + ' Focus Point'
    },

    renderFocusPointForm: function() {
        this.setState({
            modalDisplay: !this.state.modalDisplay
        });
    },

    modal: function() {
        if (this.state.modalDisplay) {
            return (
                <Modal>
                    <div className="box">
                        <h4 className="title">{this.addOrEditFocusPoint()}</h4>
                        <p className="control">
                            <label className="label">Name</label>
                            <input className="input" type="text" placeholder="Text input" ref="newConceptName"/>
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
                <button type='button' onClick={this.renderFocusPointForm} className={'button ' + classy}>{this.addOrEditFocusPoint()}</button>
                {this.modal()}
            </div>
        );
    }

});
