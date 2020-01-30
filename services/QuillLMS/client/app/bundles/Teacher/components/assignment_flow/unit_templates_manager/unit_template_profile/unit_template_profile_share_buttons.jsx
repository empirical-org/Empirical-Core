import React from 'react';
import _ from 'underscore';

export default class UnitTemplateProfileShareButtons extends React.Component {

  urlEncodedMessage() {
    const { text, } = this.props
    return encodeURI(text) ;
  }

  render() {
    const { url, text, } = this.props

    const stuff = [
      {
        icon: 'fa-twitter',
        className: 'btn-twitter',
        href: `http://twitter.com/home?status=${encodeURIComponent(text)}`,
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
      <a className={`btn btn-default btn-social ${hash.className}`} href={hash.href} key={hash.title} rel="noopener noreferrer" target="_blank" title={hash.title}>
        <i className={`fab ${hash.icon}`} /><span className="social-action">{hash.action}</span>
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
  }
}
