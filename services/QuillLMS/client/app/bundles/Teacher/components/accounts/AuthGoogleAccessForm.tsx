import * as React from 'react'
import getAuthToken from '../modules/get_auth_token'

// TODO: These two constants should be populated via config/initializers/omniauth.rb
export const AUTH_GOOGLE_ONLINE_ACCESS_PATH = "/auth/google/online_access"
export const AUTH_GOOGLE_OFFLINE_ACCESS_PATH = "/auth/google/offline_access"

const AuthGoogleAccessForm = ({
  buttonClass = '',
  formClass = '',
  offlineAccess = false,
  showIcon = true,
  spanClass = '',
  text
}) => {
  const action = offlineAccess ? AUTH_GOOGLE_OFFLINE_ACCESS_PATH : AUTH_GOOGLE_ONLINE_ACCESS_PATH

  return (
    <form
      action={action}
      className={formClass}
      method="post"
    >
      <input name="authenticity_token" type="hidden" value={getAuthToken()} />
      <button className={buttonClass} type="submit">
        {showIcon && <img alt="Google icon" src={`${import.meta.env.VITE_PROCESS_ENV_CDN_URL}/images/shared/google_icon.svg`} />}
        <span className={spanClass}>{text}</span>
      </button>
    </form>
  )
}

export default AuthGoogleAccessForm
