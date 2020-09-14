import React from 'react'

const ListItem = (props: any) => (
  <div {...props} className="list-item">{props.children}</div>
)

export { ListItem }
