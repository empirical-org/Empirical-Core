'use strict';
import $ from 'jquery'
import React from 'react'

export default React.createClass({
  getInitialState: function () {
    return {
      redirectUri: null,
      clientId: null,
      cleverScope: null,
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
      redirectUri: data.redirect_uri,
      clientId: data.client_id,
      cleverScope: data.clever_scope,
      detailsLoaded: true
    });
  },

  failure: function () {
    this.setState({notAvailable: true});
  },

  buildLink: function () {
    var link;
    if (this.state.detailsLoaded) {
      var base, scope, redirectUri, clientId;
      base = "https://clever.com/oauth/authorize?response_type=code";
      scope = "&scope=" + encodeURIComponent(this.state.cleverScope);
      redirectUri = "&redirect_uri=" + encodeURIComponent(this.state.redirectUri);
      clientId = "&client_id=" + encodeURIComponent(this.state.clientId);
      link = base + scope + redirectUri + clientId;
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
                  <img className='google-sign-up' src='/images/sign_up_with_clever.png'/>
                </a>);
    }
    return result;
  }
});
