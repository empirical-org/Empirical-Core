import React from 'react'
export default React.createClass({

  render: function(){
    return(
  <div className='pricing-mini'>
    <header className='pricing-mini-header purple'>
      <div className='img-holder'>
          <img src="/images/school_premium_icon.png" alt="teacher_premium_icon"/>
      </div>
      <h4>School & District Premium</h4>
    </header>
    <section className='pricing-info'>
      <div className='premium-rates all-h4'>
      <h4>Discounts available<br/>for multiple schools</h4>
      </div>
      <ul>
        <li>Everything in Teacher Premium</li>
        <li>Professional development sessions</li>
        <li>Batch rostering students</li>
        <li>Administrator dashboard for school-<br/>
          wide and district-wide information
        </li>
      </ul>
    </section>
    <a href='https://quillpremium.wufoo.com/forms/quill-premium-quote'><button type='button' className='btn btn-default mini-btn purple'>Learn More</button></a>
  </div>
);
  }
});
