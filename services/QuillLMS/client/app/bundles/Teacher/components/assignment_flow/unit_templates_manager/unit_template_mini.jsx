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
    let link
    if (this.props.data.id == 'createYourOwn') {
      if (this.isSignedIn()) {
        link = '/assign/create-activity-pack'
      } else {
        link = '/account/new'
      }
    } else {
      if (this.isSignedIn()) {
        link = `/assign/featured-activity-packs/${this.props.data.id}`;
      } else {
        link = `/activities/packs/${this.props.data.id}`
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

  avatarUrl() {
    return this.props.data.author ? this.props.data.author.avatar_url : null
  }

  displayPicture() {
    return (
      <div className='author-picture'>
        <img src={this.avatarUrl()} />
      </div>
    );
  }

  miniSpecificComponents() {
    if (this.props.data.id == 'createYourOwn') {
      return (
        <a href={this.getLink()}>
          <div className='text-center create-your-own'>
            <div className='content-wrapper'>
              <img className='plus_icon' src='/add_class.png' />
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
          data={this.props.data}
          modules={{string: this.modules.string}}
        />
        <UnitTemplateSecondRow data={this.props.data} modules={{string: this.modules.string}} />
        {this.displayPicture()}
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
