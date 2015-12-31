EC.UnitTemplateProfileShareButtons = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  urlForPublicPage: function () {
    debugger;
    return window.location.origin + "/activities/packs/" + this.props.data.id;
  },

  render: function () {
    var url = this.urlForPublicPage();

    var stuff = [
      {
        icon: 'fa-envelope',
        className: 'btn-linkedin',
        href: "mailto:?subject=Checkout this " + this.props.data.name +  " Activity pack by Quill.org&source=Quill.org&body=" + url,
        title: 'Share by Email',
      },
      {
        icon: 'fa-twitter',
        className: 'btn-twitter',
        href: "http://twitter.com/home?status=" + url + " checkout this " + this.props.data.name +  " Activity pack by @Quill_org",
        title: 'Share on Twitter',
      },
      {
        icon: 'fa-facebook',
        className: 'btn-facebook',
        href: "https://www.facebook.com/share.php?u=" + url,
        title: "Share this Activity pack on Facebook",
      }
    ]

    var links = _.map(stuff, function (hash) {
      return (
        <a href={hash.href} title={hash.title} className={"btn btn-default btn-social " + hash.className}  target="_blank">
          <i className={"fa " + hash.icon}></i>
        </a>
      );
    });

    return (
      <div className='share light-gray-bordered-box'>
        <strong>Share this Activity Pack</strong>
        {links}
      </div>
    )
  }

});
