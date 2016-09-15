'use strict'

import React from 'react'
import Modal from 'react-bootstrap/lib/Modal';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import ModalContent from './ModalContent.jsx'

export default React.createClass({
  getInitialState() {
    return {show: true, slideIndex: 0};
  },

  showModal() {
    this.setState({show: true});
  },

  hideModal() {
    this.setState({show: false});
    location.href = 'diagnostic#/stage/2'
  },

  modalContent() {
    return <ModalContent content={this.modalSlides()[this.state.slideIndex]}/>
  },

  modalSlides(){
    return([
      {imgSrc: "/images/diagnostic_slide/diagnostic_intro_slide_1.svg",
        imgAlt: "diagnostic overview",
        h1: "What’s Being Tested",
        p: "The diagnostic covers eight fundamental areas of sentence structure, giving you insight into your students’ ability to effectively create both basic and advanced sentences.",
        a: null
      },
      {imgSrc: "/images/diagnostic_slide/diagnostic_intro_slide_2.svg",
        imgAlt: "diagnostic overview",
        h1: "Student Responses Analyzed",
        p: "Quill automatically analyzes and grades open-ended responses. It identifies the writing skills students know and the skills they need to practice.",
        a: null
      },
      {imgSrc: "/images/diagnostic_slide/diagnostic_intro_slide_3.svg",
        imgAlt: "diagnostic overview",
        h1: "Recommended Activities",
        p: "You can then view a variety of reports to identify individual student and class-wide learning gaps. Quill generates a personalized learning plan for students based on where they need the most help.",
        a: null
      },
      {imgSrc: "/images/diagnostic_slide/diagnostic_intro_slide_4.svg",
        imgAlt: "diagnostic overview",
        h1: "Evidence Based",
        p: "The diagnostic evaluates student writing using an evidence based strategy called sentence combining. This strategy explicitly teaches students how to write sophisticated, complex sentences.",
        a: "Check out the research.",
        ahref: "/"
      },
    ])
  },

  handClick(){
    if (this.state.slideIndex < this.modalSlides().length - 1) {
      this.setState({slideIndex: this.state.slideIndex + 1})
    } else {
      alert('got to next state')
    }
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
            <div id='close-wrapper'>
                  <img className='pull-right react-bootstrap-close' onClick={this.hideModal} src="images/close_x.svg" alt="close-modal"/>
            </div>

            <br/>
            {this.modalContent()}
            {/*<img className='modal-intro' src="images/diagnostic_overview.svg" alt=""/>
            <h1>Adaptive Testing</h1>
            <p>In this type of diagnostic, questions are selected dynamically such that the difficulty of each question is adapted to the estimated ability of the student.</p>*/}
          </Modal.Body>
          <Modal.Footer>
            <button className="button-green" onClick={this.handClick}>Next</button>
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
