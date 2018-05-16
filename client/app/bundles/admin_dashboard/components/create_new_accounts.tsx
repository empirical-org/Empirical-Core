import * as React from 'react'
import DropdownMenu from '../../Teacher/components/progress_reports/dropdown_filter'

class CreateNewAccounts extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      school: {
        value: '',
        name: ''
      }
    }

    this.updateField = this.updateField.bind(this)
    this.updateSchool = this.updateSchool.bind(this)
    this.schoolsList = this.schoolsList.bind(this)
    this.schoolOptions = this.schoolOptions.bind(this)
    this.addTeacherAccount = this.addTeacherAccount.bind(this)
    this.renderMessage = this.renderMessage.bind(this)
    this.renderError = this.renderError.bind(this)
  }

  updateField(e, fieldName) {
    this.setState({[fieldName]: e.target.value})
  }

  updateSchool(school) {
    this.setState({school: school})
  }

  schoolsList() {
    return this.props.schools.map(school =>
      <div className="school" key={school.id}><img src="https://assets.quill.org/images/icons/school_icon_admin.svg"/>{school.name}</div>
    )
  }

  schoolOptions() {
    return this.props.schools.map(school => {
      return {
        name: school.name,
        value: school.id
      }
    })
  }

  addTeacherAccount() {
    const data = {
      teacher: {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email
      },
      id: this.state.school.value
    }
    this.props.addTeacherAccount(data)
  }

  renderError() {
    if (this.props.error) {
      return <div className="error">{this.props.error}</div>
    }
  }

  renderMessage() {
    if (this.props.message) {
      return <div className="message">{this.props.message}</div>
    }
  }

  render() {
    return <div id="create_new_accounts">
      <div className="header">
        <h2>Create New Accounts and Link Existing Teachers</h2>
        <a className="green-link" href="mailto:becca@quill.org?subject=Bulk Upload Teachers via CSV&body=Please attach your CSV file to this email.">
          <button className="bg-white text-black">Upload Teachers via CSV</button>
        </a>
      </div>
      <p><span>Teachers New to Quill?</span> Input their information to create new Quill accounts.</p>
      <p>
        <span>Teachers Have Quill Accounts?</span> When you submit their information, they will receive an email instructing them to link their accounts to your school. Teachers can link to their school from the My Account page.
        <a className="green-link" href="http://support.quill.org/getting-started-for-teachers/manage-classes/how-can-i-connect-my-account-to-my-school" target="_blank"> Here's the guide.</a>
      </p>
      <div className="form-and-schools-list">
        <div className="form">
          <div className="first-line">
            <input className="first-name" value={this.state.firstName} onChange={(e) => this.updateField(e, 'firstName')} placeholder="First Name" type="text"></input>
            <input className="last-name" value={this.state.lastName} onChange={(e) => this.updateField(e, 'lastName')} placeholder="Last Name" type="text"></input>
            <input className="email" value={this.state.email} onChange={(e) => this.updateField(e, 'email')} placeholder="Email Address" type="text"></input>
          </div>
          <DropdownMenu
            className='second-line'
            options={this.schoolOptions()}
            selectedOption={this.state.school}
            selectOption={this.updateSchool}
            placeholder='Select School for Teacher'
          />
          <button className="button-green pull-right" onClick={this.addTeacherAccount}>Add Teacher Account</button>
        </div>
        <div className="schools">
          <p>You have admin access to these schools:</p>
          <div className="schools-list">
            {this.schoolsList()}
          </div>
          <p className="need-access pull-right">Need access to additional schools? <a className="green-link" href="mailto:becca@quill.org">Email Becca</a></p>
        </div>
      </div>
      {this.renderError()}
      {this.renderMessage()}
    </div>
  }
}

export default CreateNewAccounts;
