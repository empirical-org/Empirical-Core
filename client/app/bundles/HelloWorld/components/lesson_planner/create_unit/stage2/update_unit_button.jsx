import React from 'react'
import $ from 'jquery'

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
    const p = this.props;
    const that = this;
    this.setState({loading: true})
    $.ajax({
      type: 'PUT',
      url: p.putUrl,
      data: p.dataFunc(),
      statusCode: {
        200: function(data) {
          that.setState({loading: false}, ()=>p.successCallback())
        },
        422: function(response) {
          that.setState({errors: response.responseJSON.errors,
          loading: false})
        }
      }
    })
  }

	render() {
    const button = this.props.showButton ? <a className="q-button cta-button bg-quillgreen text-white" onClick={this.handleClick}>{this.props.buttonText}</a> : null
    return (
      <div>
        {button}
        <span className="errors">{this.state.errors}</span>
      </div>
    )
	}

}

UpdateUnitButton.propTypes = {
  putUrl: React.PropTypes.string.isRequired,
  successCallback: React.PropTypes.func.isRequired,
  buttonText: React.PropTypes.string.isRequired,
  dataFunc: React.PropTypes.func.isRequired,
  showButton: React.PropTypes.bool.isRequired,
}


export default UpdateUnitButton
