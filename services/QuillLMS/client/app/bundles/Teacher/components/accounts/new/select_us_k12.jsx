import React from 'react';
import request from 'request'
import Input from '../../shared/input'
import AnalyticsWrapper from '../../shared/analytics_wrapper'
import getAuthToken from '../../modules/get_auth_token';

const smallWhiteCheckSrc = `${process.env.CDN_URL}/images/shared/check-small-white.svg`

class SignUpTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      schools: []
    }

    this.updateKeyValue = this.updateKeyValue.bind(this);
    this.update = this.update.bind(this);
    this.search = this.search.bind(this)
    this.toggleNewsletter = this.toggleNewsletter.bind(this)
  }

  updateKeyValue(key, value) {
    const newState = Object.assign({}, this.state);
    newState[key] = value;
    this.setState(newState, this.search);
  }

  update(e) {
    this.updateKeyValue(e.target.id, e.target.value)
  }

  search(e) {
    const { firstName, lastName, email, password, sendNewsletter } = this.state
    e.preventDefault();
    request({
      url: `${process.env.DEFAULT_URL}/account`,
      method: 'POST',
      json: {
        user: {
          name: `${firstName} ${lastName}`,
          password,
          email,
          role: 'teacher',
          send_newsletter: sendNewsletter,
        },
        authenticity_token: getAuthToken(),
      },
    },
    (err, httpResponse, body) => {
      if (httpResponse.statusCode === 200) {
        // console.log(body);
        window.location = '/sign-up/add-k12'
      } else {
        let state
        if (body.errors) {
          state = { lastUpdate: new Date(), errors: body.errors, }
        } else {
          let message = 'You have entered an incorrect email or password.';
          if (httpResponse.statusCode === 429) {
            message = 'Too many failed attempts. Please wait one minute and try again.';
          }
          state = { lastUpdate: new Date(), message: (body.message || message), }
        }
        this.setState(state)
      }
    });
  }

  render () {
    return (
      <div className="container account-form select-k12">
        <h1>Let's find your school</h1>
        <div className="school-search-container">
          <Input
            label="Search by school name or zip code"
            value={this.state.search}
            handleChange={this.update}
            type="text"
            className="search"
            error={this.state.errors.search}
            id="search"
          />
        </div>
        <a href="/sign-up/add-non-k12">I don't teach at a U.S. K-12 school</a>
      </div>
    )
  }
}

export default SignUpTeacher
