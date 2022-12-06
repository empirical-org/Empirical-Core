import * as React from 'react';
import qs from 'qs'

import PasswordWrapper from '../shared/password_wrapper'
import Agreements from '../shared/agreements'
import TeacherSignUpInfo from '../shared/teacher_sign_up_info'
import { Input, } from '../../../../Shared/index'
import { requestPut, } from '../../../../../modules/request/index'

const SCHOOL_ADMIN = 'school admin'
const DISTRICT_ADMIN = 'district admin'

jest.mock('qs', () => ({
  default: {
    parse: jest.fn(() => ({}))
  }
}))

const accountTypeCopy = (accountType) => {
  switch(accountType) {
    case SCHOOL_ADMIN:
      return 'school admin account'
    case DISTRICT_ADMIN:
      return 'district admin account'
    default:
      return 'account'
  }
}

const FinishSetUp = ({ email, passedFirstName, passedLastName, token, }) => {
  const [firstName, setFirstName] = React.useState(passedFirstName)
  const [lastName, setLastName] = React.useState(passedLastName)
  const [password, setPassword] = React.useState('')
  const [errors, setErrors] = React.useState({})
  const [timesSubmitted, setTimesSubmitted] = React.useState(0)

  const { accountType, adminFullName, schoolName, } = qs.parse(window.location.search.replace('?', ''))
  const creatorCopy = adminFullName && schoolName && ` by ${adminFullName} at ${schoolName}`

  function handleSubmit(e) {
    e.preventDefault();

    requestPut(
      `${process.env.DEFAULT_URL}/account/${token}`,
      {
        user: {
          name: `${firstName} ${lastName}`,
          password,
        }
      },
      (body) => {
        window.location.href = process.env.DEFAULT_URL
      },
      (body) => {
        setErrors(body.errors)
        setTimesSubmitted(timesSubmitted + 1)
      }
    )
  }

  function onChangeFirstName(e) { setFirstName(e.target.value) }
  function onChangeLastName(e) { setLastName(e.target.value) }
  function onChangePassword(e) { setPassword(e.target.value) }

  function submitClass() {
    let buttonClass = "quill-button contained primary medium focus-on-light"
    if (!password.length || !firstName.length || !lastName.length || !email.length) {
      buttonClass += ' disabled'
    }
    return buttonClass
  }

  return (
    <div className="container account-form finish-set-up">
      <h1>Finish setting up your account</h1>
      <p className="sub-header">A Quill {accountTypeCopy(accountType)} was created for you{creatorCopy}. To complete your account setup, please set a password.</p>
      <div className="info-and-form-container">
        <TeacherSignUpInfo />
        <div className="account-container text-center">
          <div className="teacher-signup-form">
            <div>
              <form acceptCharset="UTF-8" onSubmit={handleSubmit} >
                <input aria-hidden="true" aria-label="utf8" name="utf8" type="hidden" value="✓" />
                <div className="name">
                  <Input
                    autoComplete="given-name"
                    className="first-name"
                    error={errors.first_name}
                    handleChange={onChangeFirstName}
                    id="firstName"
                    label="First name"
                    timesSubmitted={timesSubmitted}
                    type="text"
                    value={firstName}
                  />
                  <Input
                    autoComplete="family-name"
                    className="last-name"
                    error={errors.last_name}
                    handleChange={onChangeLastName}
                    id="lastName"
                    label="Last name"
                    timesSubmitted={timesSubmitted}
                    type="text"
                    value={lastName}
                  />
                </div>
                <Input
                  autoComplete="email"
                  className="email disabled"
                  disabled={true}
                  id="email"
                  type="email"
                  value={email}
                />
                <PasswordWrapper
                  autoComplete="new-password"
                  className="password inspectletIgnore"
                  error={errors.password}
                  id="password"
                  label="Set your password"
                  onChange={onChangePassword}
                  timesSubmitted={timesSubmitted}
                  value={password}
                />
                <input aria-label="Sign up" className={submitClass()} name="commit" type="submit" value="Log in" />
              </form>
            </div>
          </div>
        </div>
      </div>
      <Agreements />
    </div>
  )
}

export default FinishSetUp
