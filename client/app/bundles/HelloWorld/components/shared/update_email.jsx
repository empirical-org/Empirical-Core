import React from 'react'
import emailValidator from '../modules/email_validator'
import $ from 'jquery'

export default class extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      error: null,
      email: this.props.email || null,
      updated: false,
    }

    this.handleChange = this.handleChange.bind(this)
    this.setErrorOrSubmit = this.setErrorOrSubmit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.showEmailErrors = this.showEmailErrors.bind(this)
  }

  handleChange(val) {
    this.setState({email: val.target.value, updated: false})
  }

  setErrorOrSubmit(){
    // this should use a more restful route ---
    // right now all of the teacher's self updating is carried out
    // through the classroom manager controller
    if (emailValidator(this.state.email)) {
      const that = this;
      $.ajax({
          url: '/teachers/update_current_user',
          data: { teacher: {email: that.state.email}
          },
          type: 'put',
          statusCode: {
            200: function() {
              that.setState({updated: true}) },
            400: function(response) {
              let error
              if (response.responseJSON.errors.email) {
                error = 'This email address is already in use. If this is your email, please log in with that account.'
              }
              that.setState({error})
            }
          }
      });
    } else {
      this.setState({error: 'Invalid email address! Please re-type your email address.'})
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    this.setState({error: null}, this.setErrorOrSubmit)
  }

  showEmailErrors() {
    let content
    if (this.state.error) {
      content = <span><i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{this.state.error}</span>
    }
    return <div className="error">{content}</div>
  }

  render(){
    const inputBorderColor = this.state.error ? { 'border': '1px solid #ff4542'} : { 'border': '1px solid #737373'}
    return(<div>
      <form onSubmit={this.handleSubmit}>
          <input type="text" value={this.state.email || 'Enter your email address'} style={inputBorderColor} onChange={this.handleChange}/>
          <input type="submit" className='q-button cta-button bg-white text-black' value={this.state.updated
              ? 'Updated!'
              : 'Update Email'} disabled={this.state.updated}/>
      </form>
      {this.showEmailErrors()}
    </div>)
  }
}
