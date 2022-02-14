import React from 'react'
import { Link } from 'react-router-dom'

import UnitTemplateFirstRow from './unit_template_first_row'
import UnitTemplateSecondRow from './unit_template_second_row'

import String from '../../modules/string.jsx'

export default class UnitTemplateMini extends React.Component {
  constructor(props) {
    super(props)

    this.modules = { string: new String() }
  }

  isSignedIn() {
    const { signedInTeacher, non_authenticated, } = this.props
    return signedInTeacher || (non_authenticated === false)
  }

  getLink() {
    const { data, } = this.props
    let link
    if (data.id == 'createYourOwn') {
      if (this.isSignedIn()) {
        link = '/assign/activity-library'
      } else {
        link = '/account/new'
      }
    } else {
      if (this.isSignedIn()) {
        link = `/assign/featured-activity-packs/${data.id}`;
      } else {
        link = `/activities/packs/${data.id}`
      }
    }
    return link
  }

  renderMini(innerContent) {
    if (this.isSignedIn()) {
      return (<Link to={this.getLink()}>{innerContent}</Link>)
    }

    return <a href={this.getLink()}>{innerContent}</a>
  }

  miniSpecificComponents() {
    const { data, } = this.props
    if (data.id == 'createYourOwn') {
      return (
        <a href={this.getLink()}>
          <div className='text-center create-your-own'>
            <div className='content-wrapper'>
              <img alt="" className='plus_icon' src='/add_class.png' />
              <h3>Create Your Own Activity Pack</h3>
              <h5 style={{paddingTop: '5px'}}>Select from over 150 grammar exercises.</h5>
            </div>
          </div>
        </a>
      );
    }
    // else it is a normal mini
    else {
      const innerContent = (<div>
        <UnitTemplateFirstRow
          data={data}
          modules={{string: this.modules.string}}
        />
        <UnitTemplateSecondRow data={data} modules={{string: this.modules.string}} />
      </div>)

      return this.renderMini(innerContent)
    }
  }

  render() {
    return (
      <div className='unit-template-mini' onClick={this.onClickAction}>
        {this.miniSpecificComponents()}
      </div>
    );
  }
}
