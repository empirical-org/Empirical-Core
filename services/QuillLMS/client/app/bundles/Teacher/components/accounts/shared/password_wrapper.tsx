import * as React from 'react'

import { Input } from '../../../../Shared/index'

const passwordVisibleSrc = `${process.env.CDN_URL}/images/icons/icons-visibility-on.svg`
const passwordNotVisibleSrc = `${process.env.CDN_URL}/images/icons/icons-visibility-off.svg`

const PasswordWrapper = ({ autoComplete, className, error, onChange, id, label, timesSubmitted, value, }) => {
  const [showPassword, setShowPassword] = React.useState(false)

  function toggleShowPassword() { setShowPassword(!showPassword) }

  return (
    <div className="password-wrapper">
      <Input
        autoComplete={autoComplete}
        className={className}
        error={error}
        handleChange={onChange}
        id={id}
        label={label}
        timesSubmitted={timesSubmitted}
        type={showPassword ? 'text' : 'password'}
        value={value}
      />
      <button aria-label={showPassword ? 'Hide password' : 'Show password'} className="interactive-wrapper focus-on-light" onClick={toggleShowPassword} type="button"><img alt="" src={showPassword ? passwordNotVisibleSrc : passwordVisibleSrc} /></button>
    </div>
  )
}

export default PasswordWrapper
