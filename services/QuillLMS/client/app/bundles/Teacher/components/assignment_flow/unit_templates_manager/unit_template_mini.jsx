import React from 'react'
import { Link } from 'react-router'
import UnitTemplateFirstRow from './unit_template_first_row'
import UnitTemplateSecondRow from './unit_template_second_row'
import String from '../../modules/string.jsx'

export default class UnitTemplateMini extends React.Component {
  constructor(props) {
    super(props)

    this.modules = { string: new String() }
  }

  avatarUrl() {
    return this.props.data.author ? this.props.data.author.avatar_url : null
  }

  displayPicture() {
    return (
      <div className='author-picture'>
        <img src={this.avatarUrl()}/>
      </div>
    );
  }

  getLink() {
    let link
    if (this.props.data.id == 'createYourOwn') {
      if (this.props.signedInTeacher || (this.props.non_authenticated === false)) {
        link = '/assign/create-unit'
      } else {
        link = '/account/new'
      }
    } else {
      if (this.props.signedInTeacher || (this.props.non_authenticated === false)) {
        link = `/assign/featured-activity-packs/${this.props.data.id}`;
      } else {
        link = `/activities/packs/${this.props.data.id}`
      }
    }
    return link
  }

  miniSpecificComponents() {
    if (this.props.data.id == 'createYourOwn') {
      return (
        <Link to={this.getLink()}>
          <div className='text-center create-your-own'>
            <div className='content-wrapper'>
              <img className='plus_icon' src='/add_class.png'/>
              <h3>Create Your Own Activity Pack</h3>
              <h5 style={{paddingTop: '5px'}}>Select from over 150 grammar exercises.</h5>
            </div>
          </div>
        </Link>
      );
    }
    // else it is a normal mini
    else {
      return(
          <Link to={this.getLink()}>
            <div>
              <UnitTemplateFirstRow
                  data={this.props.data}
                  modules={{string: this.modules.string}} />
              <UnitTemplateSecondRow data={this.props.data} modules={{string: this.modules.string}} />
              {this.displayPicture()}
            </div>
          </Link>
        );
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
