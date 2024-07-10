import * as React from 'react'
import { DataTableChip, Tooltip } from "../../Shared";

export function getTimeSpent(seconds: number) {
  if(!seconds) {
    return 'N/A';
  }
  if(seconds < 60) {
    return `<1 min`;
  }
  if(seconds >= 60 && seconds < 120) {
    return '1 min';
  }
  if(seconds >= 120 && seconds < 3600) {
    return `${Math.floor((seconds % 3600) / 60)} mins`;
  }
  if(seconds >= 3600 && seconds < 3660) {
    return '1 hr';
  }
  const hours = Math.floor(seconds / 60 / 60);
  const minutes = Math.floor((seconds % 3600) / 60)
  const hoursText = hours > 1 ? 'hrs' : 'hr';
  if(minutes) {
    const minuteText = minutes > 1 ? 'mins' : 'min';
    return `${hours} ${hoursText} ${minutes} ${minuteText}`;
  }
  return `${hours} ${hoursText}`;
}

interface renderTooltipRowProps {
  color?: string,
  icon?: {
    alt: string,
    src: string
  }
  id: number,
  label: string,
  link?: string,
  headerWidth: number
}

export function renderTooltipRow({ color, icon, id, label, link, headerWidth }: renderTooltipRowProps) {
  const averageFontWidth = 8
  let style: React.CSSProperties = { width: `${headerWidth}px`, minWidth: `${headerWidth}px` }
  const dataTableChip = <DataTableChip color={color} icon={icon} label={label} link={link} />
  if ((String(label).length * averageFontWidth) >= headerWidth) {
    return (
      <Tooltip
        key={id}
        tooltipText={label}
        tooltipTriggerStyle={style}
        tooltipTriggerText={dataTableChip}
        tooltipTriggerTextStyle={style}
      />
    )
  } else {
    return dataTableChip
  }
}
