EC.UnitTemplateProfileShareButtons = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired
  },

  urlForPublicPage: function () {
    return window.location.origin + "/activities/packs/" + this.props.data.model.id
  },

  render: function () {
    return (
      <div className='share light-gray-bordered-box'>
        <strong>Share this Activity Pack</strong>
        <a href={"https://www.linkedin.com/shareArticle?mini=true&url=" + this.urlForPublicPage() + "&title=Checkout this " + this.props.data.model.name +  " Activity pack by @Quill_org&source=Quill.org"} title="Share on LinkedIn" target="_blank" className="btn btn-default btn-social btn-linkedin"><i className="fa fa-linkedin"></i></a>
        <a href={"http://twitter.com/home?status=" + this.urlForPublicPage() + " checkout this " + this.props.data.model.name +  " Activity pack by @Quill_org"} title="Share on Twitter" target="_blank" className="btn btn-default btn-social btn-twitter"><i className="fa fa-twitter"></i></a>
        <a href={"https://www.facebook.com/share.php?u=" + this.urlForPublicPage()} title="Share this Activity pack on Facebook" target="_blank" className="btn btn-default btn-social btn-facebook"><i className="fa fa-facebook"></i></a>
      </div>
    )
  }

});