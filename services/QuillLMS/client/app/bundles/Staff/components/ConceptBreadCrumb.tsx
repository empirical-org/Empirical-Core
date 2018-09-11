import React from 'react'
import {Breadcrumb} from 'antd'
import {Link} from 'react-router'


export default ({concept}) => {
  if (concept) {
    return (
      <Breadcrumb.Item><Link to={concept.id}>{concept.name}</Link></Breadcrumb.Item> 
    )
  }
  return null
}