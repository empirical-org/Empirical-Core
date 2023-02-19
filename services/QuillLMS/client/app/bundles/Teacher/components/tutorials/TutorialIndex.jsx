import React from 'react';
import LessonsSlides from './LessonsSlides';
import getParameterByName from '../modules/get_parameter_by_name';
import $ from 'jquery';

import { requestPost, } from '../../../../modules/request/index'

export default class TutorialIndex extends React.Component {
  constructor(props) {
    super(props);

    let slides;
    switch (props.match.params.tool) {
      case 'lessons':
      default:
        slides = LessonsSlides;
        break;
    }

    this.state = {
      slides,
      slideNumber: props.match.params.slideNumber ? Number(props.match.params.slideNumber) : 1,
    };

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (Number(nextProps.match.params.slideNumber) === this.state.slides.length) {
      this.finishTutorial();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  circles() {
    const circles = this.state.slides.map((el, index) => {
      const currSlide = this.state.slideNumber - 1;
      const current = index === currSlide ? 'current' : null;
      return (<div className={`${current} circle`} key={index} onClick={() => this.goToSlide(index + 1)} />);
    });
    return <div className="circles">{circles}</div>;
  }

  finishTutorial() {
    if (this.props.match.params.tool === 'lessons') {
      requestPost(`${import.meta.env.DEFAULT_URL}/milestones/complete_view_lesson_tutorial`)
    }
  }

  goToSlide(slideNumber) {
    this.props.history.push(`/tutorials/${this.props.match.params.tool}/${slideNumber}${this.qs()}`);
    this.setState({ slideNumber ,  });
  }

  handleKeyDown(event) {
    if (event.keyCode === 39 && this.state.slideNumber !== this.state.slides.length) {
      this.goToSlide(this.state.slideNumber + 1);
    } else if (event.keyCode === 37 && this.state.slideNumber !== 1) {
      this.goToSlide(this.state.slideNumber - 1);
    }
  }

  nextButton() {
    const lessonsUrl = import.meta.env.QUILL_LESSONS_URL || 'https://quill.org/lessons';
    if (this.state.slideNumber !== this.state.slides.length) {
      return <button className="text-white bg-quillgreen next-button" onClick={() => this.goToSlide(this.state.slideNumber + 1)}>Next</button>;
    } else if (getParameterByName('url')) {
      const url = getParameterByName('url');
      return <button className="text-white bg-quillgreen next-button" onClick={() => window.location = decodeURIComponent(url)}>Next</button>;
    } else if (getParameterByName('nocta')) {
      return <div style={{ height: '55px', }} />;
    }
    return <button className="text-white bg-quillgreen try-button" onClick={() => { window.location = `${lessonsUrl}/#/teach/class-lessons/-KsKpXAoaEIY5jvWMIzJ/preview`; }}>Try Sample Activity</button>;
  }

  previousButton() {
    if (this.state.slideNumber !== 1) {
      return <button className="text-quillgreen previous-button interactive-wrapper" onClick={() => this.goToSlide(this.state.slideNumber - 1)} type="button">Back</button>;
    }
    return <div className="text-quillgreen previous-button interactive-wrapper" style={{ height: '22px', }} />;
  }

  qs() {
    if (getParameterByName('url')) {
      return `?url=${encodeURIComponent(getParameterByName('url'))}`;
    } else if (getParameterByName('nocta')) {
      return `?nocta=${getParameterByName('nocta')}`;
    }
    return '';
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
    );
  }
}
