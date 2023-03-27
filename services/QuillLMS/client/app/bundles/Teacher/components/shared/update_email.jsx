import $ from 'jquery'
import React from 'react'
import emailValidator from '../modules/email_validator'

export default class extends React.Component{
  constructor(props){
    super(props)

    this.state = {
      error: null,
      email: this.props.email || null,
      updated: false,
    }
  }

  setErrorOrSubmit = () => {
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
  };

  handleChange = val => {
    this.setState({email: val.target.value, updated: false})
  };

  handleSubmit = event => {
    event.preventDefault()
    this.setState({error: null}, this.setErrorOrSubmit)
  };

  showEmailErrors = () => {
    let content
    if (this.state.error) {
      content = <span><i aria-hidden="true" className="fas fa-exclamation-triangle" />{this.state.error}</span>
    }
    return <div className="error">{content}</div>
  };

  render(){
    const inputBorderColor = this.state.error ? { 'border': '1px solid #ff4542'} : {'display': 'inherit'}
    const input = this.state.email
      ? <input onChange={this.handleChange} style={inputBorderColor} type="text" value={this.state.email} />
      : <input onChange={this.handleChange} placeholder="Update your Quill email" style={inputBorderColor} type="text" />


    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          {input}
          <input
            className='q-button cta-button bg-white text-black'
            disabled={this.state.updated}
            type="submit"
            value={this.state.updated
              ? 'Updated!'
              : 'Update Email'}
          />
        </form>
        {this.showEmailErrors()}
      </div>
    )
  }
}
