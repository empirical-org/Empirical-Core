import React from 'react'

import { SMALL, MEDIUM, POSITIVE, NEGATIVE, } from './shared'

const smallArrowUpIcon = <img alt="Arrow pointing up" src={`${process.env.CDN_URL}/images/pages/administrator/small_arrow_up_icon.svg`} />
const smallArrowDownIcon = <img alt="Arrow pointing down" src={`${process.env.CDN_URL}/images/pages/administrator/small_arrow_down_icon.svg`} />
const mediumArrowUpIcon = <img alt="Arrow pointing up" src={`${process.env.CDN_URL}/images/pages/administrator/medium_arrow_up_icon.svg`} />
const mediumArrowDownIcon = <img alt="Arrow pointing down" src={`${process.env.CDN_URL}/images/pages/administrator/medium_arrow_down_icon.svg`} />

interface SnapshotCountProps {
  label: string;
  size: 'small'|'medium';
  queryKey: string;
  comingSoon?: boolean;
}

const SnapshotCount = ({ label, size, queryKey, comingSoon, }: SnapshotCountProps) => {
  const [count, setCount] = React.useState(null)
  const [change, setChange] = React.useState(0)
  const [changeDirection, setChangeDirection] = React.useState(null)

  // query will happen in here

  const className = `snapshot-item snapshot-count ${size} ${changeDirection || ''}`

  let icon

  if (changeDirection === POSITIVE) {
    icon = size === SMALL ? smallArrowUpIcon : mediumArrowUpIcon
  } else if (changeDirection === NEGATIVE) {
    icon = size === SMALL ? smallArrowDownIcon : mediumArrowDownIcon
  }

  return (
    <section className={className}>
      <div className="count-and-label">
        {comingSoon ? <span className="coming-soon">Coming soon</span> : <span className="count">{count?.toLocaleString() || '—'}</span>}
        <span className="snapshot-label">{label}</span>
      </div>
      <div className="change">
        {icon}
        <span>{change}%</span>
      </div>
    </section>
  )
}

export default SnapshotCount
