import React from 'react';
import { useNavigate, useParams, } from "react-router-dom-v5-compat";

import getParameterByName from '../modules/get_parameter_by_name';
import LessonsSlides from './LessonsSlides';

import { requestPost, } from '../../../../modules/request/index';

const LESSONS = 'lessons'

const TutorialIndex = ({}) => {
  const navigate = useNavigate();
  const params = useParams();

  const defaultSlideNumber = params.slideNumber ? Number(params.slideNumber) : 1
  let defaultSlides

  switch (params.tool) {
    case LESSONS:
    default:
      defaultSlides = LessonsSlides;
      break;
  }

  const [slideNumber, setSlideNumber] = React.useState(defaultSlideNumber)
  const [slides, setSlides] = React.useState(defaultSlides)

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  React.useEffect(() => {
    if (Number(params.slideNumber) === slides.length) {
      finishTutorial();
    }
  }, [params.slideNumber])

  function circles() {
    const circles = slides.map((el, index) => {
      const currSlide = slideNumber - 1;
      const current = index === currSlide ? 'current' : null;
      return (<div className={`${current} circle`} key={index} onClick={() => goToSlide(index + 1)} />);
    });
    return <div className="circles">{circles}</div>;
  }

  function finishTutorial() {
    if (params.tool === LESSONS) {
      requestPost(`${process.env.DEFAULT_URL}/milestones/complete_view_lesson_tutorial`)
    }
  }

  function goToSlide(slideNumber) {
    navigate(`/tutorials/${params.tool}/${slideNumber}${qs()}`);
    setSlideNumber(slideNumber)
  }

  function handleKeyDown(event) {
    if (event.keyCode === 39 && slideNumber !== slides.length) {
      goToSlide(slideNumber + 1);
    } else if (event.keyCode === 37 && slideNumber !== 1) {
      goToSlide(slideNumber - 1);
    }
  }

  function nextButton() {
    const lessonsUrl = process.env.QUILL_LESSONS_URL || 'https://quill.org/lessons';
    if (slideNumber !== slides.length) {
      return <button className="text-white bg-quillgreen next-button" onClick={() => goToSlide(slideNumber + 1)}>Next</button>;
    } else if (getParameterByName('url')) {
      const url = getParameterByName('url');
      return <button className="text-white bg-quillgreen next-button" onClick={() => window.location = decodeURIComponent(url)}>Next</button>;
    } else if (getParameterByName('nocta')) {
      return <div style={{ height: '55px', }} />;
    }
    return <button className="text-white bg-quillgreen try-button" onClick={() => { window.location = `${lessonsUrl}/#/teach/class-lessons/-KsKpXAoaEIY5jvWMIzJ/preview`; }}>Try Sample Activity</button>;
  }

  function previousButton() {
    if (slideNumber !== 1) {
      return <button className="text-quillgreen previous-button interactive-wrapper" onClick={() => goToSlide(slideNumber - 1)} type="button">Back</button>;
    }
    return <div className="text-quillgreen previous-button interactive-wrapper" style={{ height: '22px', }} />;
  }

  function qs() {
    if (getParameterByName('url')) {
      return `?url=${encodeURIComponent(getParameterByName('url'))}`;
    } else if (getParameterByName('nocta')) {
      return `?nocta=${getParameterByName('nocta')}`;
    }
    return '';
  }

  return (
    <div className="tutorial-slides">
      {slides[slideNumber - 1]}
      <div className="slide-controls">
        {nextButton()}
        {previousButton()}
        {circles()}
      </div>
    </div>
  );
}

export default TutorialIndex
