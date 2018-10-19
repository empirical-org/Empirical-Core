import React from 'react';
import _ from 'underscore';

export default React.createClass({

  propTypes: {
    url: React.PropTypes.string.isRequired,
    text: React.PropTypes.string.isRequired,
  },

  urlEncodedMessage() {
    return encodeURI(this.props.text) ;
  },

  render() {
    const url = this.props.url;

    const stuff = [
      {
        icon: 'fa-twitter',
        className: 'btn-twitter',
        href: `http://twitter.com/home?status=${encodeURIComponent(this.props.text)}`,
        title: 'Share on Twitter',
        action: 'Tweet',
      },
      {
        icon: 'fa-facebook',
        className: 'btn-facebook',
        href: `https://www.facebook.com/share.php?u=${url}`,
        title: 'Share this Activity pack on Facebook',
        action: 'Post',
      },
      {
        icon: 'fa-google-plus',
        className: 'btn-google-plus',
        href: `https://plus.google.com/share?url=${url}`,
        title: 'Share with Google Plus',
        action: 'Post',
      },
      {
        icon: 'fa-pinterest',
        className: 'btn-linkedin',
        href: `https://pinterest.com/pin/create/button/?url=${url}&media=https%3A%2F%2Fassets.quill.org%2Fimages%2Fshare%2Fpinterest.png&description=${this.urlEncodedMessage()}`,
        title: 'Share on Pinterest',
        action: 'Pin',
      }
    ];

    const links = _.map(stuff, hash => (
      <a href={hash.href} key={hash.title} title={hash.title} className={`btn btn-default btn-social ${hash.className}`} target="_blank">
        <i className={`fa ${hash.icon}`} /><span className="social-action">{hash.action}</span>
      </a>
      ));

    return (
      <div className="share light-gray-bordered-box">
        <strong>Share this Activity Pack</strong>
        <div className="container" style={{ width: 'auto', }}>
          {links}
        </div>
      </div>
    );
  },

});
