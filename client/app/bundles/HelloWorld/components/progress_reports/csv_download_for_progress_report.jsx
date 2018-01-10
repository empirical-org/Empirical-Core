import React from 'react'
import {CSVDownload, CSVLink} from 'react-csv'
import userIsPremium from '../modules/user_is_premium'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userIsPremium: userIsPremium(),
      showDropdown: false
    }
    this.toggleDropdown = this.toggleDropdown.bind(this)
  }

  handleClick(){
    alert('Downloadable reports are a Premium feature. Visit Quill.org/premium to upgrade now!')
  }

  toggleDropdown(){
    this.setState({showDropdown: !this.state.showDropdown})
  }

  render() {
    // if (this.state.userIsPremium && this.props.data) {
      let dropdown, style, c
      if (this.state.showDropdown) {
        style = {
          // border: "solid 1px #00c2a2",
          boxShadow: "0 0 0 1px #00c2a2",
          backgroundColor:'#fff',
          color: '#00c2a2'
        }
        dropdown = (<div className='dropdown-content'>
                      Download report as:
                      <span className='pull-right'>
                      <div><i className="fa  fa-caret-up gray-caret" aria-hidden="true"></i></div>
                      <div><i className="fa fa-caret-up " aria-hidden="true"></i></div>
                    </span>

                      <div className='button-wrapper'>
                        <button onClick={window.print}><img src="https://assets.quill.org/images/icons/pdf-icon.svg" alt="print"/>Print</button>
                            <CSVLink data={this.props.data} target="_blank">
                              <button><img src="https://assets.quill.org/images/icons/csv-icon.svg" alt="csv"/>CSV</button>
                            </CSVLink>
                      </div>
                    </div>)
      }
      return (
        <div className='download-button-wrapper'>
          <button onClick={this.toggleDropdown} style={style} className={this.props.className || 'btn button-green'}>{this.props.buttonCoppy || "Download Report"}</button>
          {dropdown}
        </div>
      )
    // } else {
    //   return <button style={{display: 'block'}} onClick={this.handleClick} className={this.props.className || 'btn button-green'}>{this.props.buttonCoppy || "Download Report"}</button>
    // }
  }

}
