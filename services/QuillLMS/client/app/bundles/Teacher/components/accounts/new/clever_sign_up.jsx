'use strict';
import $ from 'jquery'
import React from 'react'

export default class CleverSignUp extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectUri: null,
      clientId: null,
      cleverScope: null,
      detailsLoaded: false,
      notAvailable: false
    }
  }

  componentDidMount() {
    $.get('/clever/auth_url_details').then(this.loadState, this.failure)
  }

  buildLink = () => {
    const { detailsLoaded, cleverScope, redirectUri, clientId, } = this.state
    if (!detailsLoaded) { return '' }

    const base = "https://clever.com/oauth/authorize?response_type=code";
    const scopeQuery = "&scope=" + encodeURIComponent(cleverScope);
    const redirectUriQuery = "&redirect_uri=" + encodeURIComponent(redirectUri);
    const clientIdQuery = "&client_id=" + encodeURIComponent(clientId);
    return base + scopeQuery + redirectUriQuery + clientIdQuery;
  }

  failure = () => {
    this.setState({notAvailable: true});
  }

  handleClick = (e) => {
    window.location.href = this.buildLink()
  }

  handleKeyDown = (e) => {
    if (e.key !== 'Enter') { return }
    this.handleClick(e)
  }

  loadState = (data) => {
    this.setState({
      redirectUri: data.redirect_uri,
      clientId: data.client_id,
      cleverScope: data.clever_scope,
      detailsLoaded: true
    });
  }

  render() {
    const { notAvailable, } = this.state
    if (notAvailable) { return <span /> }
    return (
      <button className='clever-sign-up' onClick={this.handleClick} onKeyDown={this.handleKeyDown} type="button">
        <img alt="Clever icon" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/clever_icon.svg`} />
        <span>Sign up with Clever</span>
      </button>
    )
  }
}
