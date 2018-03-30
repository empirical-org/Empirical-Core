import React from 'react'

export default (props) =>

(<div className="header-section">
  <div className="text">
    <h1>{props.title}</h1>
    <p>{props.subtitle}</p>
  </div>
  <form action={`${process.env.DEFAULT_URL}/teacher_resources/search`}>
    <input type='text' placeholder='Search for posts' name='query' defaultValue={props.query ? props.query : null}/>
    <i className="fa fa-icon fa-search"/>
  </form>
</div>
)
