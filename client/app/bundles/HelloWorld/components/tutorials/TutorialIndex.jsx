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
      slideNumber: props.params.slideNumber || 1
    }
  }

  circles () {
    const circles = this.state.slides.map((el, index)=>{
      let currSlide = this.state.slideNumber - 1;
      let current = index === currSlide ? 'current' : null;
      return (<div key={index} onClick={() => this.goToSlide(index + 1)} className={current + ' circle'}></div>)
    })
    return <div className="circles">{circles}</div>
  }

  goToSlide(slideNumber) {
    this.setState({slideNumber: slideNumber})
  }

    render() {
      return (
        <div className="tutorial-slides">
          {this.state.slides[this.state.slideNumber - 1]()}
          <div className="slide-controls">
            <button className="text-white bg-quillgreen next-button" onClick={() => this.goToSlide(this.state.slideNumber + 1)}>Next</button>
            <p className="text-quillgreen previous-button" onClick={() => this.goToSlide(this.state.slideNumber - 1)}>Back</p>
            {this.circles()}
          </div>
        </div>
      )
    }
  }
