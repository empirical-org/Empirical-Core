import * as React from 'react'

interface ActivityDetailsSectionPropsInterface {
  key: string;
  customClass?: string;
  header: string;
  description: string | Element
}
export const ActivityDetailsSection = ({ key, customClass, header, description }: ActivityDetailsSectionPropsInterface) => {
  if(!header || !description) { return }

  const descriptionElement = typeof (description) === "string" ? <p className="description">{description}</p> : description
  const containerClassName = `activity-tooltip-details-section ${customClass || ''}`
  return(
    <div className={containerClassName} key={key}>
      <p className="header">{header}</p>
      {descriptionElement}
    </div>
  )
}

export default ActivityDetailsSection
