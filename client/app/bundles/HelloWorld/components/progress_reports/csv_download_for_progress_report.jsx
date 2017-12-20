import React from 'react'
import {CSVDownload, CSVLink} from 'react-csv'
import userIsPremium from '../modules/user_is_premium'

export default class extends React.Component {
  //
  constructor(props) {
    super(props)
    this.state = {
      userIsPremium: userIsPremium()
    }
  }

  handleClick(){
    alert('Downloadable reports are a Premium feature. You can visit Quill.org/premium to upgrade now!')
  }

  render() {
    if (this.state.userIsPremium && this.props.data) {
      return (
        <CSVLink data={this.props.data} target="_blank">
          <button style={{display: 'block'}} className={this.props.className || 'btn button-green'}>{this.props.buttonCoppy || "Download Report"}</button>
        </CSVLink>
      )
    } else {
      return <button style={{display: 'block'}} onClick={this.handleClick} className={this.props.className || 'btn button-green'}>{this.props.buttonCoppy || "Download Report"}</button>
    }
  }

}
