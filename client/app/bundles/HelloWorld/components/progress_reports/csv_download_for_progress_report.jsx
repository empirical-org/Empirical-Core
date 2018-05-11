import React from 'react'
import {CSVDownload, CSVLink} from 'react-csv'
import userIsPremium from '../modules/user_is_premium'
import _ from 'underscore'
import _l from 'lodash'

export default class extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      userIsPremium: userIsPremium(),
      showDropdown: false
    }

    document.addEventListener('click', this.closeDropdownIfOpen.bind(this))

    this.toggleDropdown = this.toggleDropdown.bind(this)
  }


  componentDidMount() {
    this.cleanData(this.props.data)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeDropdownIfOpen.bind(this));
  }

  cleanData(data) {
    let finalValue
    if (!Array.isArray(data[0])) {
      const copiedData = JSON.parse(JSON.stringify(data))
      let newData = []
      copiedData.forEach(row => {
        if (this.props.keysToOmit) {
          row = this.omitKeys(row)
        }
        if (this.props.valuesToChange) {
          this.changeValues(row)
        }
        if (!this.props.preserveCasing) {
          this.getRidOfCamelCase(row)
        }
        newData.push(row)
      })
      finalValue = newData
    } else {
      finalValue = data
    }
    this.setState({data: finalValue})
  }

  getRidOfCamelCase(row){
    const keys = Object.keys(row)
    keys.forEach(oldKey=>{
      const newKey = _l.startCase(oldKey)
      row[newKey] = row[oldKey];
      delete row[oldKey];
    })
  }

  omitKeys(row) {
    return _.omit(row, this.props.keysToOmit)
  }

  changeValues(row) {
    this.props.valuesToChange.forEach(keyFunction => {
      row[keyFunction.key] = keyFunction.function(row[keyFunction.key])
    })
  }

  handleClick() {
    alert('Downloadable reports are a Premium feature. Visit Quill.org/premium to upgrade now!')
  }

  toggleDropdown() {
    this.setState({
      showDropdown: !this.state.showDropdown
    })
  }

  closeDropdownIfOpen(e) {
    if (this.state.showDropdown && e.target.classList.value !== 'btn button-green' && e.target.classList.value !== 'print-button' && e.target.classList.value !== 'print-img') {
      this.setState({ showDropdown: false})
    }
  }

  render() {
    if (this.state.userIsPremium && this.props.data) {
      let dropdown,
        style,
        c
      if (this.state.showDropdown) {
        style = {
          // border: "solid 1px #00c2a2",
          boxShadow: "0 0 0 1px #00c2a2",
          backgroundColor: '#fff',
          color: '#00c2a2'
        }
        dropdown = (
          <div className='dropdown-content' onBlur={this.toggleDropdown}>
            Download report as:
            <span className='pull-right'>
              <div>
                <i className="fa  fa-caret-up gray-caret" aria-hidden="true"></i>
              </div>
              <div>
                <i className="fa fa-caret-up " aria-hidden="true"></i>
              </div>
            </span>

            <div className='button-wrapper'>
              <button onClick={window.print} className="print-button"><img className="print-img" src="https://assets.quill.org/images/icons/pdf-icon.svg" alt="print"/>PDF</button>
              <CSVLink data={this.state.data} target="_blank">
                <button><img src="https://assets.quill.org/images/icons/csv-icon.svg" alt="csv"/>CSV</button>
              </CSVLink>
            </div>
          </div>
        )
      }
      return (
        <div className='download-button-wrapper'>
          <button onClick={this.toggleDropdown} style={style} className={this.props.className || 'btn button-green'}>{this.props.buttonCopy || "Download Report"}</button>
          {dropdown}
        </div>
      )
    } else {
      return <button style={{
        display: 'block'
      }} onClick={this.handleClick} className={this.props.className || 'btn button-green'}>{this.props.buttonCopy || "Download Report"}</button>
    }
  }

}
