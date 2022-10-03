import React from 'react'
import { renderToString } from 'react-dom/server'

import UnitTemplateFirstRow from './unit_template_first_row'
import UnitTemplateSecondRow from './unit_template_second_row'

import String from '../../modules/string.jsx'
import { CLICKED_ACTIVITY_PACK_ID, CREATE_YOUR_OWN_ID } from '../assignmentFlowConstants'
import { Tooltip } from '../../../../Shared'

export class UnitTemplateMini extends React.Component {
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

  renderTooltipElement() {
    const { data } = this.props
    if (!data) { return }
    const { activities } = data;
    const table = (
      <table className="activity-tooltip-table">
        <tbody>
          <tr>
            <th>Activity</th>
            <th>Tool</th>
            <th>Grade Level Range</th>
          </tr>
          {activities && activities.length && activities.map(activity => {
            const { name, readability, classification } = activity
            return(
              <tr>
                <td>{name}</td>
                <td>{classification.name}</td>
                <td>{readability}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    )
    return renderToString(table)
  }

  miniSpecificComponents() {
    const { data, } = this.props
    const { id } = data;
    if (id === CREATE_YOUR_OWN_ID) {
      return (
        <div className='text-center create-your-own'>
          <div className='content-wrapper'>
            <img alt="plus icon" className='plus_icon' src='https://assets.quill.org/images/icons/plus-icon.svg' />
            <h3>Create your own activity pack</h3>
            <h5 style={{paddingTop: '5px'}}>Select from over 800 writing activities</h5>
          </div>
        </div>
      );
    }
    return (
      <div className="unit-template-mini-inner-container" id={id} ref={this.miniRef}>
        <UnitTemplateFirstRow
          data={data}
          modules={{string: this.modules.string}}
        />
        <UnitTemplateSecondRow data={data} modules={{string: this.modules.string}} />
      </div>
    )
  }

  handleClick = () => {
    const url = this.getLink()
    window.location.href = url
  }

  renderMiniContent = () => {
    return(
      <button className='unit-template-mini interactive-wrapper focus-on-light' onClick={this.handleClick}>
        {this.miniSpecificComponents()}
      </button>
    )
  }

  render() {
    const { data } = this.props
    const { id } = data;
    if(id === CREATE_YOUR_OWN_ID) {
      return this.renderMiniContent()
    }
    return (
      <Tooltip
        isTabbable={false}
        tooltipText={this.renderTooltipElement()}
        tooltipTriggerText={this.renderMiniContent()}
      />
    );
  }
}

export default UnitTemplateMini
