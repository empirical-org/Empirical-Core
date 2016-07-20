'use strict'

 import React from 'react'
 import _ from 'underscore'

 export default  React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  urlForPublicPage: function () {
    return window.location.origin + "/activities/packs/" + (this.props.data.id ? this.props.data.id:this.props.data.model.id);
  },

  render: function () {
    var url = this.urlForPublicPage();

    var stuff = [
      {
        icon: 'fa-twitter',
        className: 'btn-twitter',
        href: "http://twitter.com/home?status=" + url + " check out this " + this.props.data.name +  " Activity pack by @Quill_org",
        title: 'Share on Twitter',
        action: 'Tweet',
      },
      {
        icon: 'fa-facebook',
        className: 'btn-facebook',
        href: "https://www.facebook.com/share.php?u=" + url,
        title: "Share this Activity pack on Facebook",
        action: 'Post'
      },
      {
        icon: 'fa-google-plus',
        className: 'btn-google-plus',
        href: "https://plus.google.com/share?url=" + url,
        title: 'Share with Google Plus',
        action: 'Post',
      },
      {
        icon: 'fa-pinterest',
        className: 'btn-linkedin',
        href: 'https://pinterest.com/pin/create/button/?url=www.quill.org/activities/packs/4&media=https%3A//s-media-cache-ak0.pinimg.com/736x/92/46/50/9246509b2ad54a3c2ad97e21976b9176.jpg&description=I%E2%80%99m%20using%20the%20' + this.props.data.name + '%20Activity%20Pack,%20from%20Quill.org,%20to%20teach%20English%20grammar.%20' + url,
        title: 'Share on Pinterest',
        action: 'Pin',
      }
      // {
      //   icon: 'fa-envelope',
      //   className: 'btn-linkedin',
      //   href: "mailto:?subject=Check out this " + this.props.data.name +  " Activity pack by Quill.org&source=Quill.org&body=" + url,
      //   title: 'Share by Email',
      // }
    ];

    var links = _.map(stuff, function (hash) {
      return (
        <a href={hash.href} title={hash.title} className={"btn btn-default btn-social " + hash.className}  target="_blank">
          <i className={"fa " + hash.icon}></i><span className='social-action'>{hash.action}</span>
        </a>
      );
    });

    return (
      <div className='share light-gray-bordered-box'>
          <strong>Share this Activity Pack</strong>
          <div className='container'>
            {links}
          </div>
      </div>
    );
  }

});
