'use strict';
EC.CleverSignUp = React.createClass({
  getInitialState: function () {
    return {
      redirect_uri: null,
      client_id: null,
      detailsLoaded: false,
      notAvailable: false
    };
  },

  componentDidMount: function () {
    var that = this;
    $.get('/clever/auth_url_details')
      .then(this.loadState, this.failure)
  },

  loadState: function (data) {
    this.setState({
      redirect_uri: data.redirect_uri,
      client_id: data.client_id,
      detailsLoaded: true
    });
  },

  failure: function () {
    this.setState({notAvailable: true});
  },

  buildLink: function () {
    var link;
    if (this.state.detailsLoaded) {
      var base, scope, redirect_uri, client_id;
      base = "https://clever.com/oauth/authorize?response_type=code";
      scope = "&scope=" + encodeURIComponent('read:user')
      redirect_uri = "&redirect_uri=" + encodeURIComponent(this.state.redirect_uri);
      client_id = "&client_id=" + encodeURIComponent(this.state.client_id);
      link = base + scope + redirect_uri + client_id;
    } else {
      link = "";
    }
    return link;
  },

  render: function () {
    var result;
    if (this.state.notAvailable) {
      result = <span></span>;
    } else {
      result = (<a href={this.buildLink()}>
                  <div className='clever-sign-up'></div>
                </a>);
    }
    return result;
  }
});