import * as React from 'react'

import { DropdownInput, } from '../../Shared/index'

const roleOptions = [{ value: 'teacher', label: 'Teacher' }, { value: 'admin', label: 'Admin' }]

export class CreateNewAccounts extends React.Component<any, any> {
  constructor(props) {
    super(props)

    const { adminAssociatedSchool, schools, } = props

    const defaultSchool = schools.find(s => s.id === adminAssociatedSchool?.id) || schools[0]

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      school: defaultSchool,
      role: null
    }
  }

  updateField = (e, fieldName) => this.setState({[fieldName]: e.target.value})

  handleFirstNameChange = (e) => this.updateField(e, 'firstName')

  handleLastNameChange = (e) => this.updateField(e, 'lastName')

  handleEmailChange = (e) => this.updateField(e, 'email')

  updateRole = (role) => this.setState({ role, })

  updateSchool = (school) => this.setState({ school })

  schoolsList = () => {
    const { schools, } = this.props
    return schools.map(school => {
      const { id, name } = school
      return(
        <div className="school" key={id}>
          <img alt="" src="https://assets.quill.org/images/icons/school_icon_admin.svg" />
          <p>{name}</p>
        </div>
      )
    })
  }

  schoolOptions = () => {
    const { schools, } = this.props
    return schools.map(school => {
      const { name, id } = school
      return {
        name: name,
        value: id,
        label: name
      }
    })
  }

  handleSubmitClick = () => {
    const { firstName, lastName, email, school, role, } = this.state
    const { addTeacherAccount, } = this.props

    const data = {
      teacher: {
        first_name: firstName,
        last_name: lastName,
        role,
        email
      },
      school_id: school.value || school.id
    }
    addTeacherAccount(data)
  }

  renderError = () => {
    const { error, } = this.props
    if (!error) { return }

    return <div className="error">{error}</div>
  }

  render() {
    const { firstName, lastName, email, school, role, } = this.state
    const supportLink = <a href="http://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-connect-my-account-to-my-school" rel="noopener noreferrer" target="_blank"> Here&#39;s the guide</a>

    return (
      <div className="create-new-accounts-container">
        <section className="left-section">
          <h2>Create and Link Accounts</h2>
          <div className="form">
            <section className="first-section">
              <section className="name-inputs-container">
                <input aria-label="First Name" className="first-name" onChange={this.handleFirstNameChange} placeholder="First Name" type="text" value={firstName} />
                <input aria-label="Last Name" className="last-name" onChange={this.handleLastNameChange} placeholder="Last Name" type="text" value={lastName} />
              </section>
              <input aria-label="Email Address" className="email" onChange={this.handleEmailChange} placeholder="Email Address" type="text" value={email} />
            </section>
            <section className="second-section">
              <DropdownInput
                className='school-selector'
                handleChange={this.updateSchool}
                isSearchable={true}
                options={this.schoolOptions()}
                placeholder='Select school for teacher'
                value={this.schoolOptions().find(s => s.value === school.id || s.value === school.value)}
              />
              <DropdownInput
                className='role-selector'
                handleChange={this.updateRole}
                label='Select role'
                options={roleOptions}
                value={role}
              />
              <button className="quill-button small primary contained add-teacher-account-button" onClick={this.handleSubmitClick} type="button">Submit</button>
            </section>
            <div className='light-divider' />
            <section className="info-section-container">
              <section className="info-section">
                <span>How does this work for new accounts?</span>
                <p>An account linked to the selected school will be created on their behalf and they will receive an email with the login details.</p>
              </section>
              <section className="info-section">
                <span>How does this work for existing accounts?</span>
                <p>They will receive an email asking them to link their account to the selected school. They can also link to their school from the <a href="/teachers/my_account">My Account</a> page. {supportLink}.</p>
              </section>
            </section>
          </div>
        </section>
        <section className="right-section">
          <h2>You have admin access to these schools:</h2>
          <section className="content-section">
            <div className="schools-list">
              {this.schoolsList()}
            </div>
            <section className="bottom-section">
              <div className='light-divider' />
              <p className="need-access-text">Need access to additional schools? <a className="green-link" href="mailto:hello@quill.org">Email support@quill.org</a></p>
            </section>
          </section>
        </section>
        {this.renderError()}
      </div>
    )
  }
}

export default CreateNewAccounts;
