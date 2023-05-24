import React from 'react'

import { SMALL, MEDIUM, POSITIVE, NEGATIVE, } from './shared'

const smallArrowUpIcon = <img alt="Arrow pointing up" src={`${process.env.CDN_URL}/images/pages/administrator/small_arrow_up_icon.svg`} />
const smallArrowDownIcon = <img alt="Arrow pointing down" src={`${process.env.CDN_URL}/images/pages/administrator/small_arrow_down_icon.svg`} />
const mediumArrowUpIcon = <img alt="Arrow pointing up" src={`${process.env.CDN_URL}/images/pages/administrator/medium_arrow_up_icon.svg`} />
const mediumArrowDownIcon = <img alt="Arrow pointing down" src={`${process.env.CDN_URL}/images/pages/administrator/medium_arrow_down_icon.svg`} />

interface SnapshotItemProps {
  label: string;
  change: number;
  size: 'small'|'medium';
  count?: number;
  changeDirection?: 'positive'|'negative';
}

const SnapshotCount = ({ count, label, change, size, changeDirection,}: SnapshotItemProps) => {
  const className = `snapshot-item ${size} ${changeDirection || ''}`

  let icon

  if (changeDirection === POSITIVE) {
    icon = size === SMALL ? smallArrowUpIcon : mediumArrowUpIcon
  } else if (changeDirection === NEGATIVE) {
    icon = size === SMALL ? smallArrowDownIcon : mediumArrowDownIcon
  }

  return (
    <section className={className}>
      <div className="count-and-label">
        <span className="count">{count?.toLocaleString() || '—'}</span>
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
