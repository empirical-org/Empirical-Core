'use strict'

 import React from 'react'

 export default React.createClass({

  render: function() {
    return(
      <div className='footer-row row'>
        <div className='review-request col-md-1 col-sm-12'>
          <i className="fa fa-heart"></i>  Love Quill? <a href='https://www.graphite.org/website/quill'>Please write a review.</a>
        </div>
          <div className='footer-img col-md-3 col-md-offset-8 col-sm-12'>
          <a href='https://chrome.google.com/webstore/detail/quill/bponbohdnbmecjheeeagoigamblomimg'>
          <img src='/chrome_badge.png'></img>
          </a>
        </div>
      </div>
    );
  }
});
