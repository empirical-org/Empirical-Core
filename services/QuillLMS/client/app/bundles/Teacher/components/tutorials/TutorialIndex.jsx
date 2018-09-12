import React from 'react';
import LessonsSlides from './LessonsSlides';
import getParameterByName from '../modules/get_parameter_by_name';
import request from 'request';
import $ from 'jquery';

export default class TutorialIndex extends React.Component {
  constructor(props) {
    super(props);

    let slides;
    switch (props.params.tool) {
      case 'lessons':
      default:
        slides = LessonsSlides;
        break;
    }

    this.state = {
      slides,
      slideNumber: props.params.slideNumber ? Number(props.params.slideNumber) : 1,
    };

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    if (Number(nextProps.params.slideNumber) === this.state.slides.length) {
      this.finishTutorial();
    }
  }

  finishTutorial() {
    if (this.props.params.tool === 'lessons') {
      request.post(`${process.env.DEFAULT_URL}/milestones/complete_view_lesson_tutorial`, {
        json: { authenticity_token: $('meta[name=csrf-token]').attr('content'), },
      });
    }
  }

  circles() {
    const circles = this.state.slides.map((el, index) => {
      const currSlide = this.state.slideNumber - 1;
      const current = index === currSlide ? 'current' : null;
      return (<div key={index} onClick={() => this.goToSlide(index + 1)} className={`${current} circle`} />);
    });
    return <div className="circles">{circles}</div>;
  }

  nextButton() {
    const lessonsUrl = process.env.QUILL_LESSONS_URL || 'https://lessons.quill.org';
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

  handleKeyDown(event) {
    if (event.keyCode === 39 && this.state.slideNumber !== this.state.slides.length) {
      this.goToSlide(this.state.slideNumber + 1);
    } else if (event.keyCode === 37 && this.state.slideNumber !== 1) {
      this.goToSlide(this.state.slideNumber - 1);
    }
  }

  previousButton() {
    if (this.state.slideNumber !== 1) {
      return <p className="text-quillgreen previous-button" onClick={() => this.goToSlide(this.state.slideNumber - 1)}>Back</p>;
    }
    return <div style={{ height: '22px', }} className="text-quillgreen previous-button" />;
  }

  goToSlide(slideNumber) {
    this.props.router.push(`/tutorials/${this.props.params.tool}/${slideNumber}${this.qs()}`);
    this.setState({ slideNumber ,  });
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
