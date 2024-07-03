import * as React from 'react'

interface ClickableChipProps {
  color?: string,
  icon?: {
    alt: string,
    src: string
  },
  label: string,
  link: string
}

export const ClickableChip = ({ color, icon, label, link }: ClickableChipProps) => {
  return(
    <a className={`clickable-chip ${color}`} href={link}>
      {icon && <img alt={icon.alt} src={icon.src} />}
      <p>{label}</p>
    </a>
  )
}

export default ClickableChip
