import * as React from 'react'

interface DataTableChipProps {
  color?: string,
  icon?: {
    alt: string,
    src: string
  },
  label: string,
  link?: string
}

export const DataTableChip = ({ color, icon, label, link }: DataTableChipProps) => {
  if(link) {
    return(
      <a className={`data-table-chip ${color} focus-on-light`} href={link}>
        {icon && <img alt={icon.alt} src={icon.src} />}
        <p>{label}</p>
      </a>
    )
  }
  return (
    <div className={`data-table-chip ${color}`}>
      {icon && <img alt={icon.alt} src={icon.src} />}
      <p>{label}</p>
    </div>
  )
}

export default DataTableChip
