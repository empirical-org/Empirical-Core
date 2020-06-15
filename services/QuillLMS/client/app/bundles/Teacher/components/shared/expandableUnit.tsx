import * as React from 'react'

export interface ExpandableUnitProps {
  title: string;
  learning_cycles: {
    activities: {
      title: string;
      description: string;
      activity_link: string;
      cb_link: string;
    }[]
  }[]
}

const ExpandableUnit = (props: ExpandableUnitProps) => {
  return(
    <div />
  );
}

export default ExpandableUnit;
