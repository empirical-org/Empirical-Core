import React from 'react'


export default React.createClass({

  propTypes: {
    content: React.PropTypes.object.isRequired
  },

  render() {
    const p = this.props.content;
    return (
      <div>
        <img className='modal-intro' src={p.imgSrc} alt={p.imgAlt}/>
        <h1>{p.h1}</h1>
        <p>{p.p}</p>
      </div>
    )
  }



});
