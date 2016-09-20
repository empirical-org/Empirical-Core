import React from 'react'


export default React.createClass({

  propTypes: {
    content: React.PropTypes.object.isRequired
  },

  render() {
    const p = this.props.content;
    let a = p.a ? <a href={p.href}>{p.a}</a> : ''
    return (
      <div>
        <div className="image-wrapper">
            <img className='modal-intro' id={p.imgId} src={p.imgSrc} alt={p.imgAlt}/>
        </div>
        <h1>{p.h1}</h1>
        <div className='text'>
          <p>{p.p}</p>
          {a}
        </div>

      </div>
    )
  }



});
