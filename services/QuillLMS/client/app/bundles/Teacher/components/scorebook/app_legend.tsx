import * as React from 'react';

import useWindowSize from '../../../Shared/hooks/useWindowSize';

const baseImageSrc = `${process.env.CDN_URL}/images/pages/activity_summary`
const SCOREBOOK_MOBILE_BREAKPOINT = 600

export const AppLegend = () => {
  const size = useWindowSize();
  const evidenceDescription = size.width <= SCOREBOOK_MOBILE_BREAKPOINT ? 'Write using evidence' : 'Use a text to write with evidence';
  const diagnostic = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/diagnostic`} key="diagnostic" rel="noopener noreferrer" target="_blank">
      <img alt="" src={`${baseImageSrc}/diagnostic-grey.svg`} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Diagnostic</p>
        <p className="description">Identify learning gaps</p>
      </div>
    </a>
  )

  const lessons = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/lessons`} key="lessons" rel="noopener noreferrer" target="_blank">
      <img alt="" src={`${baseImageSrc}/lessons-grey.svg`} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Lessons</p>
        <p className="description">Shared group lessons</p>
      </div>
    </a>
  )

  const connect = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/connect`} key="connect" rel="noopener noreferrer" target="_blank">
      <img alt="" src={`${baseImageSrc}/connect-grey.svg`} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Connect</p>
        <p className="description">Combine sentences</p>
      </div>
    </a>
  )

  const proofreader = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/proofreader`} key="proofreader" rel="noopener noreferrer" target="_blank">
      <img alt="" src={`${baseImageSrc}/proofreader-grey.svg`} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Proofreader</p>
        <p className="description">Fix errors in passages</p>
      </div>
    </a>
  )

  const grammar = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/grammar`} key="grammar" rel="noopener noreferrer" target="_blank">
      <img alt="" src={`${baseImageSrc}/grammar-grey.svg`} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Grammar</p>
        <p className="description">Practice mechanics</p>
      </div>
    </a>
  )

  const evidence = (
    <a className="icon focus-on-light" href={`${process.env.DEFAULT_URL}/tools/evidence`} key="evidence" rel="noopener noreferrer" target="_blank">
      <img alt="" src={`${baseImageSrc}/evidence-grey.svg`} />
      <div className="icons-description-wrapper">
        <p className="title">Quill Reading for Evidence</p>
        <p className="description">{evidenceDescription}</p>
      </div>
    </a>
  )


  const icons = [diagnostic, lessons, connect, proofreader, grammar, evidence]

  return(
    <div className="icons-wrapper icon-legend app-legend">
      <div className="icons">
        {icons}
      </div>
    </div>
  );
}

export default AppLegend
