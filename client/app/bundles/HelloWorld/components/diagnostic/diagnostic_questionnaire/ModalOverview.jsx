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
    location.href = `/diagnostic/${this.props.diagnosticActivityId}/stage/2`
  },

  modalContent() {
    return <ModalContent content={this.modalSlides()[this.state.slideIndex]}/>
  },

  modalSlides(){
    return([
      {imgSrc: "/images/tools/diagnostic/diagnostic_intro_slide_1.svg",
        imgAlt: "diagnostic overview",
        h1: "What’s Being Tested",
        p: "The diagnostic covers eight fundamental areas of sentence structure, giving you insight into your students’ ability to effectively create both basic and advanced sentences.",
        a: null
      },
      {imgSrc: "/images/tools/diagnostic/diagnostic_intro_slide_2.svg",
        imgAlt: "diagnostic overview",
        imgId: 'responses',
        h1: "Student Responses Analyzed",
        p: "Quill automatically analyzes and grades open-ended responses. It identifies the writing skills students know and the skills they need to practice.",
        a: null
      },
      {imgSrc: "/images/tools/diagnostic/diagnostic_intro_slide_3.svg",
        imgAlt: "diagnostic overview",
        h1: "Recommended Activities",
        p: "You can then view a variety of reports to identify individual student and class-wide learning gaps. Quill generates a personalized learning plan for students based on where they need the most help.",
        a: null
      },
      {imgSrc: "/images/tools/diagnostic/diagnostic_intro_slide_4.svg",
        imgAlt: "diagnostic overview",
        h1: "Evidence Based",
        p: "The diagnostic evaluates student writing using an evidence based strategy called sentence combining. This strategy explicitly teaches students how to write sophisticated, complex sentences.",
        // a: "Check out the research.",
        ahref: "/"
      },
    ])
  },

  handleClick(){
    if (this.state.slideIndex < this.modalSlides().length - 1) {
      this.setState({slideIndex: this.state.slideIndex + 1})
    } else {
      location.href = `/diagnostic/${this.props.diagnosticActivityId}/stage/2`
    }
  },

  buttonText(){
    if (this.state.slideIndex < this.modalSlides().length - 1) {
      return 'Next'
    } else {
      return 'Next, Assign the Diagnostic'
    }
  },

  circles () {
    return this.modalSlides().map((el, index)=>{
      let currSlide = this.state.slideIndex;
      let visited = index <= currSlide ? 'visited' : null;
      return (<div className={visited + ' circle'}></div>)
    })
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
            <br/>
            {this.modalContent()}
          </Modal.Body>
          <Modal.Footer>
            <button className="button-green" onClick={this.handleClick}>{this.buttonText()}</button>
            <br/>
            {this.circles()}
          </Modal.Footer>
            </div>
        </Modal>

    );
  }
 });
