import * as React from 'react'

interface ClickableChipProps {
  color?: string,
  icon?: {
    alt: string,
    src: string
  },
  label: string,
  link?: string
}

export const ClickableChip = ({ color, icon, label, link }: ClickableChipProps) => {
  if(link) {
    return(
      <a className={`clickable-chip ${color}`} href={link}>
        {icon && <img alt={icon.alt} src={icon.src} />}
        <p>{label}</p>
      </a>
    )
  }
  return (
    <div className={`clickable-chip ${color}`}>
      {icon && <img alt={icon.alt} src={icon.src} />}
      <p>{label}</p>
    </div>
  )
}

export default ClickableChip
