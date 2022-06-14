import * as React from 'react'

import { DropdownInput, } from '../../Shared/index'

class CreateNewAccounts extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      school: props.schools[0]
    }

    this.renderMessage = this.renderMessage.bind(this)
    this.renderError = this.renderError.bind(this)
  }

  updateField = (e, fieldName) => this.setState({[fieldName]: e.target.value})

  handleFirstNameChange = (e) => this.updateField(e, 'firstName')

  handleLastNameChange = (e) => this.updateField(e, 'lastName')

  handleEmailChange = (e) => this.updateField(e, 'email')

  updateSchool = (school) => this.setState({ school })

  schoolsList = () => {
    const { schools, } = this.props
    return schools.map(school =>
      <div className="school" key={school.id}><img alt="" src="https://assets.quill.org/images/icons/school_icon_admin.svg" />{school.name}</div>
    )
  }

  schoolOptions = () => {
    const { schools, } = this.props
    return schools.map(school => {
      return {
        name: school.name,
        value: school.id,
        label: school.name
      }
    })
  }

  handleAddTeacherAccountClick = () => {
    const { firstName, lastName, email, school, } = this.state
    const { addTeacherAccount, } = this.props

    const data = {
      teacher: {
        first_name: firstName,
        last_name: lastName,
        email
      },
      id: school.value || school.id
    }
    addTeacherAccount(data)
  }

  renderError() {
    const { error, } = this.props
    if (!error) { return }

    return <div className="error">{error}</div>
  }

  renderMessage() {
    const { message, } = this.props
    if (!message) { return }

    return <div className="message">{message}</div>
  }

  render() {
    const { firstName, lastName, email, school, } = this.state
    /* eslint-disable react/jsx-no-target-blank */
    const supportLink = <a className="green-link" href="http://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-connect-my-account-to-my-school" target="_blank"> Here&#39;s the guide.</a>
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div id="create_new_accounts">
        <div className="header">
          <h2>Create New Accounts and Link Existing Teachers</h2>
          <a className="quill-button secondary outlined fun focus-on-light" href="mailto:hello@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">Upload teachers via CSV</a>
        </div>
        <p><span>Teachers New to Quill?</span> Input their information to create new Quill accounts.</p>
        <p>
          <span>Teachers Have Quill Accounts?</span> When you submit their information, they will receive an email instructing them to link their accounts to your school. Teachers can link to their school from the My Account page.
          {supportLink}
        </p>
        <div className="form-and-schools-list">
          <div className="form">
            <div className="first-line">
              <input aria-label="First Name" className="first-name" onChange={this.handleFirstNameChange} placeholder="First Name" type="text" value={firstName} />
              <input aria-label="Last Name" className="last-name" onChange={this.handleLastNameChange} placeholder="Last Name" type="text" value={lastName} />
              <input aria-label="Email Address" className="email" onChange={this.handleEmailChange} placeholder="Email Address" type="text" value={email} />
            </div>
            <DropdownInput
              className='second-line'
              handleChange={this.updateSchool}
              options={this.schoolOptions()}
              placeholder='Select School for Teacher'
              value={this.schoolOptions().find(s => s.value === school.id || s.value === school.value)}
            />
            <button className="button-green pull-right" onClick={this.handleAddTeacherAccountClick} type="button">Add Teacher Account</button>
          </div>
          <div className="schools">
            <p>You have admin access to these schools:</p>
            <div className="schools-list">
              {this.schoolsList()}
            </div>
            <p className="need-access pull-right">Need access to additional schools? <a className="green-link" href="mailto:hello@quill.org">Email Quill</a></p>
          </div>
        </div>
        {this.renderError()}
        {this.renderMessage()}
      </div>
    )
  }
}

export default CreateNewAccounts;
