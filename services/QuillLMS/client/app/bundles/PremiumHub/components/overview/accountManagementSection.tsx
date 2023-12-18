import * as React from 'react'
import { Link, } from 'react-router-dom';

import { iconLinkBase, ACCOUNT_MANAGEMENT, SECTION_NAME_TO_ICON_URL, } from './shared'

export const LOG_IN_AS_A_TEACHER = "Log in as a teacher"

export const accountManagementTiles = [
  {
    name: 'Manage Accounts',
    link: '/teachers/premium_hub/account_management',
    icon: `${iconLinkBase}/manage-accounts.svg`,
    linkText: 'Manage accounts',
    description: 'Create new accounts, manage admins, and more.',
  },
  {
    name: LOG_IN_AS_A_TEACHER,
    icon: `${iconLinkBase}/log-in-as-a-teacher.svg`,
    description: 'Access each teacher’s account to assign activities, manage rosters, and view data.',
  },
  {
    name: 'Manage Subscriptions',
    link: '/teachers/premium_hub/school_subscriptions',
    linkText: 'Manage subscriptions',
    icon: `${iconLinkBase}/manage-subscriptions.svg`,
    description: 'View subscription history, manage subscriptions, and more.',
  }
]

const AccountManagementSection = ({ handleClickLogInAsATeacher, }) => {
  const tiles = accountManagementTiles.map(tile => {
    return (
      <div className="tile" key={tile.name}>
        <div>
          <h3>{tile.name}</h3>
          <p>{tile.description}</p>
        </div>
        <div className="link-and-image">
          {tile.name === LOG_IN_AS_A_TEACHER ? <button className="quill-button focus-on-light outlined secondary medium" onClick={handleClickLogInAsATeacher} type="button">Log in as a teacher</button> : <Link className="quill-button focus-on-light outlined secondary medium" to={tile.link}>{tile.linkText}</Link>}
          <img alt="" src={tile.icon} />
        </div>
      </div>
    )
  })

  return (
    <section className="overview-section-wrapper account-management">
      <h2>
        <img alt="" src={SECTION_NAME_TO_ICON_URL[ACCOUNT_MANAGEMENT]} />
        <span>{ACCOUNT_MANAGEMENT}</span>
      </h2>
      <div className="overview-section">
        <div className="overview-section-content">
          {tiles}
        </div>
      </div>
    </section>
  )
}

export default AccountManagementSection
