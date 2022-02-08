import React from 'react'
import {CSVDownload, CSVLink} from 'react-csv'
import userIsPremium from '../modules/user_is_premium'
import _ from 'underscore'
import _l from 'lodash'

function formatData(data) {
  return data.map(row => {
    delete row['Concept Id']
    return row
  })
}

const unclickedDownloadBtnClass = "btn button-green"
const clickedDownloadBtnClass = "quill-button medium primary contained focus-on-light"
const printBtnClass = "print-button"
const printImgClass = "print-img"

export default class CSVDownloadForProgressReports extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      userIsPremium: userIsPremium(),
      showDropdown: false
    }

    document.addEventListener('click', this.closeDropdownIfOpen.bind(this))
  }


  componentDidMount() {
    this.cleanData(this.props.data)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.closeDropdownIfOpen.bind(this));
  }

  getRidOfCamelCase(row){
    const keys = Object.keys(row)
    keys.forEach(oldKey=>{
      const newKey = _l.startCase(oldKey)
      row[newKey] = row[oldKey];
      delete row[oldKey];
    })
  }

  changeValues(row) {
    this.props.valuesToChange.forEach(keyFunction => {
      row[keyFunction.key] = keyFunction.function(row[keyFunction.key])
    })
  }

  formatFilename(studentName) {
    return `concept_results_for_${studentName}`
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

  closeDropdownIfOpen(e) {
    const { className, } = this.props
    const ignoreClasses = [printBtnClass, printImgClass, clickedDownloadBtnClass, unclickedDownloadBtnClass, className]
    if (this.state.showDropdown && !ignoreClasses.includes(e.target.classList.value)) {
      this.setState({ showDropdown: false})
    }
  }

  handleClick() {
    alert('Downloadable reports are a Premium feature. Visit Quill.org/premium to upgrade now!')
  }

  omitKeys(row) {
    return _.omit(row, this.props.keysToOmit)
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown })
  };

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
                <i aria-hidden="true" className="fa  fa-caret-up gray-caret" />
              </div>
              <div>
                <i aria-hidden="true" className="fas fa-caret-up " />
              </div>
            </span>

            <div className='button-wrapper'>

              <button className={printBtnClass} onClick={window.print}>
                <img
                  alt="print"
                  className={printImgClass}
                  src="https://assets.quill.org/images/icons/download-report-premium.svg"
                />PDF
              </button>

              <CSVLink
                data={formatData(this.state.data)}
                filename={this.formatFilename(this.props.studentName)}
                target="_blank"
              >
                <button>
                  <img alt="csv" src="https://assets.quill.org/images/icons/download-report-premium-csv.svg" />
                  CSV
                </button>
              </CSVLink>

            </div>
          </div>
        )
      }
      return (
        <div className='download-button-wrapper'>
          <button className={clickedDownloadBtnClass} onClick={this.toggleDropdown} style={style}>{this.props.buttonCopy || "Download Report"}</button>
          {dropdown}
        </div>
      )
    } else {
      return (
        <button
          className={this.props.className || unclickedDownloadBtnClass}
          onClick={this.handleClick}
          style={{display: 'block'}}
        >
          {this.props.buttonCopy || "Download Report"}
        </button>
      )
    }
  }
}
