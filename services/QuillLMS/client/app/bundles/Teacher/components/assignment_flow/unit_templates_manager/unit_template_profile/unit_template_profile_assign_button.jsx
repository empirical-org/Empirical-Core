import React from 'react';
import AnalyticsWrapper from '../../../shared/analytics_wrapper';
import { UNIT_TEMPLATE_NAME, ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID, } from '../../localStorageKeyConstants'

export default class UnitTemplateProfileAssignButton extends React.Component {
  analytics = () => {
    return new AnalyticsWrapper();
  };

  setLocalStorageValues = () => {
    const { data, } = this.props
    window.localStorage.setItem(UNIT_TEMPLATE_NAME, data.name)
    window.localStorage.setItem(ANONYMOUS_ASSIGN_UNIT_TEMPLATE_ID, data.id)
  }

  handleClickLogIn = () => {
    this.setLocalStorageValues()
    window.location.href = '/session/new'
  }

  handleClickSignUp = () => {
    this.setLocalStorageValues()
    window.location.href = '/account/new'
  }

  propsSpecificComponent = () => {
    if (!this.props.data.non_authenticated) { return }

    return (<div className="login-or-signup-container light-gray-bordered-box">
      <strong>Log in or sign-up to assign</strong>
      <div className="login-or-signup-buttons">
        <button className="quill-button medium secondary outlined" onClick={this.handleClickLogIn}>Log in</button>
        <button className="quill-button medium primary contained" onClick={this.handleClickSignUp}>Sign up</button>
      </div>
    </div>)
  };

  render() {
    return (
      <div>
        {this.propsSpecificComponent()}
        <p className="time"><i className="far fa-clock" />Estimated Time: {this.props.data.time} mins</p>
      </div>
    );
  }
}
