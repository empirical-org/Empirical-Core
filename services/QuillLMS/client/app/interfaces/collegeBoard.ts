export interface ScrollSection {
  ref: React.RefObject<HTMLDivElement>,
  title: string,
  count?: number
}

export interface PassageAlignedUnit {
  id: number,
  title: string,
  learning_cycles: {
    activities: {
      cb_anchor_tag: string
      description: string
      title: string
      unit_template_id: string
    }[]
  }[]
}
