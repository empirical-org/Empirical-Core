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
    const supportLink = <a className="green-link" href="http://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-connect-my-account-to-my-school" target="_blank"> Here&#39;s the guide</a>
    /* eslint-enable react/jsx-no-target-blank */
    return (
      <div id="create_new_accounts">
        <section className="left-section">
          <h2>Create New Accounts & Link Existing Teachers</h2>
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
                className='second-line'
                handleChange={this.updateSchool}
                isSearchable={true}
                options={this.schoolOptions()}
                placeholder='Select School for Teacher'
                value={this.schoolOptions().find(s => s.value === school.id || s.value === school.value)}
              />
              <button className="quill-button small primary contained add-teacher-account-button" onClick={this.handleAddTeacherAccountClick} type="button">Add Teacher Account</button>
            </section>
            <div className='light-divider' />
            <section className="info-section-container">
              <section className="info-section">
                <span>Teachers New to Quill?</span>
                <p>Input their information to create new Quill accounts.</p>
              </section>
              <section className="info-section">
                <span>Teachers Have Quill Accounts?</span>
                <p>When you submit their information, they will receive an email instructing them to link their accounts to your school. Teachers can link to their school from the My Account page. {supportLink}</p>
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
        {this.renderMessage()}
      </div>
    )
  }
}

export default CreateNewAccounts;
