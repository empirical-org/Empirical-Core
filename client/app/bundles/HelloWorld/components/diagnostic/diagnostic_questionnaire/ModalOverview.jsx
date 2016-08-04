'use strict'

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal';

export default React.createClass({
  getInitialState() {
    return {show: true};
  },

  showModal() {
    this.setState({show: true});
  },

  hideModal() {
    this.setState({show: false});
    location.href = 'diagnostic#/stage/2'
  },



  render() {
    return (
        <Modal
          {...this.props}
          show={this.state.show}
          onHide={this.hideModal}
          dialogClassName="diagnostic-overview-modal"
        >
          <div id="modal-overview">
          <Modal.Body>
            <img src="images/diagnostic_overview.svg" alt=""/>
            <h1>Adaptive Testing</h1>
            <p>In this type of diagnostic, questions are selected dynamically such that the difficulty of each question is adapted to the estimated ability of the student.</p>
          </Modal.Body>
          <Modal.Footer>
            <button className="button-green">Next</button>
            <br/>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </Modal.Footer>
            </div>
        </Modal>

    );
  }
 });
