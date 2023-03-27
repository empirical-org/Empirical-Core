import React from 'react'

import { requestPost, requestPut } from '../../../../modules/request/index'
import ButtonLoadingIndicator from '../shared/button_loading_indicator'

export default class UpdateUnitButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      errors: ''
    }
  }

  handleClick = () => {
    this.setState({errors: []})
    const { requestType, url, dataFunc, successCallback, } = this.props;
    const data = dataFunc()
    if (data.classrooms_data && data.classrooms_data.errors) {
      this.setState({errors: data.classrooms_data.errors})
    } else {
      this.setState({ loading: true, })
      if (requestType === 'POST') {
        requestPost(
          `${import.meta.env.VITE_DEFAULT_URL}${url}`,
          { unit: data, },
          (body) => {
            successCallback()
          },
          (body) => {
            this.setState({ loading: false, errors: body.errors, })
          }
        )
      } else if (requestType === 'PUT') {
        requestPut(
          `${import.meta.env.VITE_DEFAULT_URL}${url}`,
          { unit: data, },
          (body) => {
            successCallback()
          },
          (body) => {
            this.setState({ loading: false, errors: body.errors, })
          }
        )
      }
    }
  };

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
