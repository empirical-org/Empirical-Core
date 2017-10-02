import React from 'react'
import $ from 'jquery'
import ButtonLoadingIndicator from '../../../shared/button_loading_indicator'

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
    const p = this.props;
    const data = p.dataFunc()
    if (data.classrooms_data && data.classrooms_data.errors) {
      this.setState({errors: data.classrooms_data.errors})
    } else {
      const that = this;
      this.setState({loading: true})
      $.ajax({
        type: p.requestType,
        url: p.url,
        data: {unit: data},
        statusCode: {
          200: function() {
            p.successCallback()
          },
          422: function(response) {
            that.setState({errors: response.responseJSON.errors,
            loading: false})
          }
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
