import * as React from 'react';

import { requestPost, } from '../../../../../../modules/request';
import { UNIT_TEMPLATE_NAME, } from '../../assignmentFlowConstants';

export const UnitTemplateAuthenticationButtons = ({ name }) => {

  function saveAnonymousAssignmentValues(redirect) {
    window.localStorage.setItem(UNIT_TEMPLATE_NAME, name)
    requestPost(
      '/session/set_post_auth_redirect',
      { post_auth_redirect: window.location.href },
      () => window.location.href = redirect
    );
  }

  function handleClickLogIn() { saveAnonymousAssignmentValues('/session/new') }

  function handleClickSignUp() { saveAnonymousAssignmentValues('/account/new') }

  return (
    <div className="login-or-signup-container light-gray-bordered-box">
      <strong>Log in or sign-up to assign</strong>
      <div className="login-or-signup-buttons">
        <button className="quill-button medium secondary outlined" onClick={handleClickLogIn}>Log in</button>
        <button className="quill-button medium primary contained" onClick={handleClickSignUp}>Sign up</button>
      </div>
    </div>
  )
}

export default UnitTemplateAuthenticationButtons
