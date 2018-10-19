import React from 'react'
import {List} from 'antd'
import {Link} from 'react-router'


export default ({concepts, title}) => {
  return (
    <List
        size="small"
        header={<div>{title}</div>}
        bordered
        dataSource={concepts}
        renderItem={({id, name}) => (<List.Item><Link to={id}>{name}</Link></List.Item>)}
      />
  )
}