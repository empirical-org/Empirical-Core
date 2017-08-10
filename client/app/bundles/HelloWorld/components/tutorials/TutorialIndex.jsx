'use strict'

import React from 'react'
import LessonsSlides from './LessonsSlides'

export default class TutorialIndex extends React.Component {
  constructor(props) {
    super(props)

    let slides
    switch (props.params.tool) {
      case 'lessons':
      default:
        slides = LessonsSlides
        break
    }

    this.state = {
      slides: slides,
      slideNumber: props.params.slideNumber ? Number(props.params.slideNumber) : 1
    }

    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
  }

  circles () {
    const circles = this.state.slides.map((el, index)=>{
      let currSlide = this.state.slideNumber - 1;
      let current = index === currSlide ? 'current' : null;
      return (<div key={index} onClick={() => this.goToSlide(index + 1)} className={current + ' circle'}></div>)
    })
    return <div className="circles">{circles}</div>
  }

  nextButton() {
    if (this.state.slideNumber !== this.state.slides.length) {
      return <button className="text-white bg-quillgreen next-button" onClick={() => this.goToSlide(this.state.slideNumber + 1)}>Next</button>
    } else if (location.search.includes('url')){
      const url = location.search.split('?url=')[1]
      return <button className="text-white bg-quillgreen next-button" onClick={() => window.location = url}>Next</button>
    } else {
      // TODO: get link for sample activity
      return <button className="text-white bg-quillgreen try-button" onClick={() => {}}>Try Sample Activity</button>
    }
  }

  handleKeyDown(event) {
    if (event.keyCode === 39 && this.state.slideNumber !== this.state.slides.length) {
      this.goToSlide(this.state.slideNumber + 1)
    } else if (event.keyCode === 37 && this.state.slideNumber !== 1) {
      this.goToSlide(this.state.slideNumber - 1)
    }
  }

  previousButton() {
    if (this.state.slideNumber !== 1) {
      return <p className="text-quillgreen previous-button" onClick={() => this.goToSlide(this.state.slideNumber - 1)}>Back</p>
    }
  }

  goToSlide(slideNumber) {
    this.props.history.push(`/tutorials/${this.props.params.tool}/${slideNumber}${location.search}`)
    this.setState({slideNumber: slideNumber})
  }

    render() {
      return (
        <div className="tutorial-slides">
          {this.state.slides[this.state.slideNumber - 1]}
          <div className="slide-controls">
            {this.nextButton()}
            {this.previousButton()}
            {this.circles()}
          </div>
        </div>
      )
    }
  }
