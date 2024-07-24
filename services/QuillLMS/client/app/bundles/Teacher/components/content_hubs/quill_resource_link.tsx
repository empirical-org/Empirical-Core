import * as React from 'react'

import ComingSoonTooltip from './coming_soon_tooltip'

const QuillResourceLink = ({ text, href, }) => {
  const className = "quill-button focus-on-light outlined medium grey"

  if (href) {
    return <a className={className} href={href} rel="noopener noreferrer" target="_blank">{text}</a>
  }

  return (
    <ComingSoonTooltip
      tooltipTrigger={<button className={className} disabled={true}>{text}</button>}
    />
  )
}

export default QuillResourceLink
