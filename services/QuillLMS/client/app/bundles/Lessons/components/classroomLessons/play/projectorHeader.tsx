import * as React from 'react';

const laptopGlyphSrc = `${process.env.CDN_URL}/images/icons/laptop-glyph.svg` ;

const ProjectorHeader = ({ studentCount, submissions, }) => {
  const submissionCount:number = submissions ? Object.keys(submissions).length : 0
  const studentCountText:string = studentCount ? `${submissionCount} of ${studentCount} have responded` : ''
  return (
    <div className="projector-header-section">
      <div className="students-type-tag tag"><img alt="Laptop Icon" src={laptopGlyphSrc} /><span>Students type response</span></div>
      <p className="answered-count">{studentCountText}</p>
    </div>
  )
}

export default ProjectorHeader
