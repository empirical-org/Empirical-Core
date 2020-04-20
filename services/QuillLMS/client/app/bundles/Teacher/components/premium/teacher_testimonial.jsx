import React from 'react'
export default class extends React.Component {
  render() {
    return(
      <div className='premium-testimonial text-center'>
        <img alt="ELL educator, Daniel Scibienski" className='img-circle' src={`${process.env.CDN_URL}/images/shared/daniel_90.png`} />
        <p className="quote-text">&quot;I’ve seen tremendous improvement in the proficiency of my students and the quality of their writing.&quot;</p>
        <p className="quote-author"><span>Daniel Scibienski</span></p>
        <p className="author-title">8th Grade ELL Educator</p>
      </div>
    );
}
}
