import React from 'react'
import $ from 'jquery'
import AssigningIndicator from '../../../shared/assigning_indicator'


class UpdateUnitButton extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this)
  }

  state = {
    loading: false,
    errors: ''
  }

  buttonText() {
    if (this.state.loading) {
      return <span>{this.props.buttonText} <AssigningIndicator/></span>
    } else
      return this.props.buttonText
  }

  handleClick() {
    const p = this.props;
    const that = this;
    this.setState({loading: true})
    $.ajax({
      type: 'PUT',
      dataType: 'json',
      url: p.putUrl,
      data: {'data': JSON.stringify(p.dataFunc())},
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
    const button = this.props.showButton ? <a className="q-button cta-button bg-quillgreen text-white" onClick={this.handleClick}>{this.buttonText()}</a> : null
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
