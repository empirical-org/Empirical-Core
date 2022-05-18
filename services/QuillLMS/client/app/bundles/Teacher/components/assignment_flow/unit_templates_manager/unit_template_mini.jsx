import React from 'react'
import { Link } from 'react-router-dom'

import UnitTemplateFirstRow from './unit_template_first_row'
import UnitTemplateSecondRow from './unit_template_second_row'

import String from '../../modules/string.jsx'
import { CLICKED_ACTIVITY_PACK_ID } from '../assignmentFlowConstants'

export default class UnitTemplateMini extends React.Component {
  constructor(props) {
    super(props)

    this.modules = { string: new String() }
    this.miniRef = React.createRef()
  }

  componentDidMount() {
    const clickedActivityPackId = window.sessionStorage.getItem(CLICKED_ACTIVITY_PACK_ID);
    const miniRefId = this.miniRef.current ? this.miniRef.current.id : null;
    const isClickedMini = clickedActivityPackId && miniRefId && clickedActivityPackId === miniRefId;

    if(isClickedMini) {
      const element = document.getElementById(clickedActivityPackId)
      if (!element) { return }
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      element.focus()
      window.scrollTo({top: y});
    }
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
    const { id } = data;
    if (id === 'createYourOwn') {
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
      const innerContent = (<div id={id} ref={this.miniRef}>
        <UnitTemplateFirstRow
          data={data}
          modules={{string: this.modules.string}}
        />
        <UnitTemplateSecondRow data={data} modules={{string: this.modules.string}} />
      </div>)

      return this.renderMini(innerContent, id)
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
