import React from 'react'

export default (props) =>

(<div className="header-section">
  <div className="text">
    <h1>{props.title}</h1>
    <p>{props.subtitle}</p>
  </div>
  <form action={`${process.env.DEFAULT_URL}/teacher-center/search`}>
    <input type='text' placeholder='Search for posts' name='query' defaultValue={props.query ? props.query : null}/>
    <i className="fa fa-icon fa-search"/>
    {props.showCancelSearchButton ? <img className="cancel-button" src={`${process.env.CDN_URL}/images/icons/CloseIcon.svg`} onClick={() => window.location.href = `${process.env.DEFAULT_URL}/teacher-center/`} /> : null}
  </form>
</div>
)
