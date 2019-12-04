import React from 'react'
import request from 'request'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'
import getAuthToken from '../modules/get_auth_token'

class UpdateUnitButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this)
  }

  state = {
    loading: false,
    errors: ''
  }

  handleClick() {
    this.setState({errors: []})
    const { requestType, url, dataFunc, successCallback, } = this.props;
    const data = dataFunc()
    if (data.classrooms_data && data.classrooms_data.errors) {
      this.setState({errors: data.classrooms_data.errors})
    } else {
      this.setState({ loading: true, })
      request({
        method: requestType,
        url: "https://quill-lms-sprint-docker.herokuapp.com${url}",
        json: {
          unit: data,
          authenticity_token: getAuthToken()
        }
      }, (e, r, body) => {
        if (r.statusCode === 200) {
          successCallback()
        } else {
          this.setState({ loading: false, errors: body.errors, })
        }
      })
    }
  }

	render() {
    let text, color, clickHandler;
    if (this.props.enabled && !this.state.loading) {
      text = this.props.buttonText;
      color = 'quillgreen';
      clickHandler = this.handleClick
    } else {
      text = this.state.loading ? <span>Saving <ButtonLoadingIndicator /></span>: this.props.disabledText;
      color = 'lightgray';
      clickHandler = null
    }
    return (
      <div>
        <a className={`q-button cta-button bg-${color} text-white`} onClick={clickHandler}>{text}</a>
        <span className="errors">{this.state.errors}</span>
      </div>
    )
	}

}

UpdateUnitButton.propTypes = {
  url: React.PropTypes.string.isRequired,
  successCallback: React.PropTypes.func.isRequired,
  buttonText: React.PropTypes.string.isRequired,
  dataFunc: React.PropTypes.func.isRequired,
  showButton: React.PropTypes.bool.isRequired,
}


export default UpdateUnitButton
